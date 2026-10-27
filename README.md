# Orbit - Space News Website

Read space news, comment, reply, react, save and see what is trending.

**Tech:** React (Vite) + Node/Express + MongoDB (Mongoose) + Axios + plain CSS.
News comes from the [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/articles).

## Before you start
- Install **Node.js 18 or newer** (the server uses the built-in `fetch`).
- Install **MongoDB Community Server** and **MongoDB Compass**, and make sure MongoDB is running.

## 1. Run the server
```bash
cd server
npm install
npm run dev
```
You should see `MongoDB connected` and `Server running on http://localhost:5000`.

`server/.env` already has:
```
MONGO_URI=mongodb://127.0.0.1:27017/orbit
PORT=5000
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d
```
Change `JWT_SECRET` to your own long random string before deploying.

## 2. Run the client (open a second terminal)
```bash
cd client
npm install
npm run dev
```
Open the link it shows (usually http://localhost:5173).

`client/.env` already has:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 3. See your data in MongoDB Compass
1. Open Compass and connect to `mongodb://127.0.0.1:27017`.
2. After you open the website once, a database called **orbit** appears.
3. Collections: `articles`, `comments`, `reactions`, `savedarticles`, `users`.

## How it works
- The first time the home page loads, the server fetches articles from the Spaceflight API and saves them in MongoDB. It only calls the API again if 60 seconds have passed.
- The home page asks the server for articles every 60 seconds (`setInterval` in `Home.jsx`).
- Category is chosen automatically from words in the title (see `detectCategory` in `articleController.js`).
- Trending score = comments + reactions + saves, calculated in `getTrending`.

## Good to know
- Users can sign up / log in (`/signup`, `/login`). Passwords are hashed with bcrypt and sessions use a JWT token kept in the browser's localStorage. Reading is open to everyone; commenting, reacting and the Mission Log need a login, and each user has their own Mission Log.
- `index.html` is in the `client` root folder because Vite needs it there.
- I added `react-router-dom` (needed for separate pages with their own URLs). Nothing else extra is used.

## API routes
| Method | Route | What it does |
|---|---|---|
| POST | /api/auth/signup, /api/auth/login | create account / log in (returns token) |
| GET | /api/auth/me | current user (needs token) |
| GET | /api/articles?category=Mars | list articles |
| GET | /api/articles/trending | top articles by score |
| GET | /api/articles/:id | one article |
| GET / POST | /api/comments/:articleId, /api/comments | get / add comment or reply (POST needs login) |
| GET / POST | /api/reactions/:articleId | get / add reaction (POST needs login) |
| GET | /api/saved | your Mission Log (needs login) |
| POST / DELETE | /api/saved/:articleId | save / remove (needs login) |
