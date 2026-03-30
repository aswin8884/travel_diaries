# 🌍 TravelApp

A full-stack travel platform built with **Django** and **React** that allows users to explore destinations, book hotels/restaurants, and share travel experiences.

---

## ✨ Features

* 🏨 Browse destinations, hotels, and restaurants
* 📸 Community posts with images, likes & comments
* 👤 User authentication (JWT) & profile management
* ⚙️ Admin dashboard to manage all content

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Django, Django REST Framework
* **Database:** SQLite / PostgreSQL
* **Auth:** JWT (SimpleJWT)

---

## 🚀 Setup

### 🔹 Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

---

🔹 Frontend

cd frontend
npm install
npm run dev

---

## 📂 Project Structure

travel_diaries/
├── travel_backend/
├── travel_frontend/
└── README.md

---

## 📌 Notes

* Backend → http://localhost:8000
* Frontend → http://localhost:5173
* Create a superuser for admin access

---
