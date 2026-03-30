# 🌍 TravelApp

> A full-stack travel platform for exploring destinations, booking hotels & restaurants, and sharing travel experiences with a community.

![Django](https://img.shields.io/badge/Django-REST_Framework-092E20?style=flat&logo=django)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=flat&logo=jsonwebtokens)

---

## ✨ Features

- 🏨 Browse destinations, hotels, and restaurants
- 📸 Community posts with images, likes & comments
- 👤 User authentication (JWT) & profile management
- ⚙️ Admin dashboard to manage all content

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS |
| Backend | Django, Django REST Framework |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT via SimpleJWT |

---

## 📂 Project Structure

```
travel_diaries/
├── travel_backend/     # Django REST API
└── travel_frontend/    # React (Vite) app
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip & npm

---

### 🔹 Clone the Repository

```bash
git clone https://github.com/your-username/travel_diaries.git
cd travel_diaries
```

---

### 🔹 Backend Setup

```bash
cd travel_backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# (Optional) Create an admin superuser
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

---

### 🔹 Frontend Setup

```bash
cd travel_frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📌 Notes

- Ensure the backend server is running before starting the frontend.
- For production, switch from SQLite to PostgreSQL by updating `DATABASES` in `settings.py`.
- A superuser account is required to access the Django admin dashboard.
- JWT tokens are used for all authenticated API requests — the frontend handles token refresh automatically.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
