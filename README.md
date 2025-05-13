# **🔗 URL Shortener API**
A backend API service for shortening long URLs into tiny, shareable links — built using Node.js and Express. Includes smart redirection, hit tracking, rate limiting, and analytics features.

## 🚀 Features

● Shorten long URLs with a POST request  

● Redirect short URLs to their original long URLs 

● Prevent duplication — same long URL returns the same short URL  

● Advertisement redirect on every 10th visit

● Request limit of 20/day per short URL

● Track usage with analytics

● View top N URLs by usage

● Persistent storage using local JSON files

# **⚙️ Setup Instructions**
➥ Clone the Repository -
git clone https://github.com/shinitks/url_shortener

➥ cd url_shortener

➥ Create a .env file with:

   MONGO_URI=your_mongodb_connection_string
   
   BASE_URL=http://localhost:3000
   
➥ Install Dependencies - npm install

➥ Run the Server - node server.js

## **🚀 API Endpoints**

POST /

Shortens a long URL.

GET /:shorturl

Redirects to:

The original URL (on normal hits)

Advertisement (on the 10th hit)

Shows "Limit exceeded" after 20 hits/day

GET /details?url=VALUE

If url is a long URL: returns its corresponding short URL.

If url is a short URL: returns its hit count.

GET /top/:number

Returns the top N most visited URLs.

Example:

GET /top/3 → returns top 3 most visited shortened links.

## 🛠 Tech Stack

 ✅ Node.js

 ✅ Express.js

 ✅ File-based JSON storage



## **👤 Author**
GitHub: @shinitks

## **📄 License**
This project is licensed under the MIT License.
