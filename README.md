# 🏡 StayNest

A full-stack accommodation booking platform inspired by Airbnb, built using the MVC architecture. StayNest allows users to browse, create, edit, and manage property listings with secure authentication, reviews, interactive maps, and cloud deployment.

> **Live Demo:** https://your-render-url.onrender.com

---

## ✨ Features

- 🔐 User Authentication (Signup, Login & Logout)
- 🏡 Create, Edit & Delete Property Listings
- ⭐ Review & Rating System
- 🗺️ Interactive Maps with Mapbox
- 📍 Automatic Geocoding from Location Names
- 👤 Owner-based Authorization
- 💬 Flash Messages for Better User Experience
- 🍪 Secure Session Management with MongoDB
- 📱 Responsive User Interface
- ☁️ Deployed on Render with MongoDB Atlas

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- EJS
- EJS-Mate

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose
- MongoDB Atlas

### Authentication & Security
- Passport.js
- Passport Local
- Passport Local Mongoose
- Express Session
- Connect Mongo
- Connect Flash

### APIs & Deployment
- Mapbox Geocoding API
- Render

---

## 📂 Project Structure

```
StayNest
│
├── controllers/
├── models/
├── routes/
├── views/
├── Public/
├── utils/
├── middleware.js
├── schema.js
├── app_final.js
└── package.json
```

---

## 🚀 Key Functionalities

### Authentication
- User Registration
- User Login & Logout
- Password Hashing
- Session-Based Authentication

### Listings
- Create Listing
- View Listing
- Edit Listing
- Delete Listing

### Reviews
- Add Reviews
- Delete Reviews
- One-to-Many Relationship between Listings and Reviews

### Authorization
- Only listing owners can edit or delete their listings.
- Only review authors can delete their reviews.

### Maps
- Converts user-entered locations into coordinates using Mapbox Geocoding.
- Displays listing locations on an interactive map.

---

## ⚙️ Installation

```bash
git clone https://github.com/GovindSChouhan/StayNest.git

cd StayNest

npm install

npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

```env
ATLASDB_URL=your_mongodb_connection_string
MAP_TOKEN=your_mapbox_access_token
SESSION_SECRET=your_secret_key
```

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Listing Details
- Create Listing
- Login Page
- Signup Page
- Interactive Map

---

## 📚 What I Learned

During the development of StayNest, I gained practical experience with:

- MVC Architecture
- RESTful Routing
- CRUD Operations
- Authentication & Authorization
- Session Management
- MongoDB Relationships
- Mongoose Schema Design
- Express Middleware
- Flash Messages
- Mapbox API Integration
- MongoDB Atlas
- Deploying Full-Stack Applications on Render

---

## 👨‍💻 Developer

**Govind Singh Chouhan**

B.Tech - Electronics & Communication Engineering

Jaypee University of Engineering & Technology

GitHub: https://github.com/GovindSChouhan

---

⭐ If you found this project interesting, consider giving it a star!
