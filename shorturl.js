const express = require('express');
const app = express();
const fs = require('fs');

function geturls() {
    try {
        const data = fs.readFileSync('./data/shorturl.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing JSON:', error);
        return [];  
    }
}

function generateShortURL() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortURL = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        shortURL += characters[randomIndex];
    }
    return shortURL;
}

let lastCheckedDate = new Date().toDateString(); 

function trackDateChange() {
    const currentDate = new Date().toDateString();  
    if (currentDate !== lastCheckedDate) {
        const urls=geturls();
        for(let i=0;i<urls.length;i++){
            urls[i].count=0;
        }
        fs.writeFileSync('./data/shorturl.json', JSON.stringify(urls, null, 2)); 

        lastCheckedDate = currentDate;  
    } 
}

setInterval(trackDateChange, 24 * 60 * 60 * 1000);

app.use(express.json());

app.get('/about', (req, res) => {
    res.send('This is the About page!');
});

app.post('/', (req, res) => {
    const urls = geturls();  

    const anse = urls.find(m => m.originalurl.toLowerCase() === req.body.originalurl.toLowerCase());

    if (anse) {
        res.send(anse.shorturl);
    } else {
        const newid = urls.length > 0 ? urls[urls.length - 1].id + 1 : 1;
        const newshort = generateShortURL();

        const newurl = {
            id: newid,
            shorturl: newshort,
            count: 0,  
            originalurl: req.body.originalurl
        };

        urls.push(newurl);

        fs.writeFile('./data/shorturl.json', JSON.stringify(urls, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving data');
            }

            res.json({ shorturl: `http://localhost:3000/${newshort}` });
        });
    }
});

app.get('/details', (req, res) => {

    const url = req.query.url ? req.query.url.trim().toLowerCase() : '';

    if (!url) {
        return res.status(400).send('ERROR: Missing "url" query parameter');
    }

    console.log('Received URL:', url);

    const urls = geturls();
    let ans;

    if (url.length > 6) {
        ans = urls.find(m => m.originalurl.trim().toLowerCase() === url);
        if (ans) {
            res.send(ans.shorturl ? `http://localhost:3000/${ans.shorturl}` : ans.count.toString());
        } else {
            res.status(404).send('ERROR: Original URL not found');
        }
    } else {
        ans = urls.find(m => m.shorturl.trim().toLowerCase() === url);
        if (ans) {
            res.send(ans.count.toString());
        } else {
            res.status(404).send('ERROR: Short URL not found');
        }
    }
});


app.get('/:shorturl', (req, res) => {
    const short = req.params.shorturl.trim();  
    const urls = geturls();  

    const ans = urls.find(m => m.shorturl.toLowerCase() === short.toLowerCase());

    if (ans) {
        ans.count++;

        if (ans.count > 20) {
            res.send("Limit exceeded");
        } else if (ans.count === 10) {
            fs.writeFileSync('./data/shorturl.json', JSON.stringify(urls, null, 2)); 
            res.redirect('https://www.google.com');  
        } else {
            fs.writeFileSync('./data/shorturl.json', JSON.stringify(urls, null, 2));
            res.redirect('https://advertising.amazon.com');  
        }
    } else {
        res.status(404).send('ERROR: 404 - Short URL found');
    }
});




app.get('/top/:number', (req, res) => {
    const number = parseInt(req.params.number, 10);

    const urls = geturls();

    urls.sort((a, b) => b.count - a.count);

    const result = urls.slice(0, number);

    res.json(result);
});

const port = 8000;
app.listen(port, () => {
    console.log('Server started on http://localhost:8000');
});
