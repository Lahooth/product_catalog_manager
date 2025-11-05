Product Catalog & Order Manager (FastAPI + PostgreSQL)

A complete Product Catalog Management System built using FastAPI and PostgreSQL, featuring an Admin Dashboard and a Customer Storefront.
Currently designed to run on a local development server, this project can easily be deployed to cloud platforms like Render or Railway for public access.

⚙️ Features

Admin Panel for managing products (create, update, delete)

PostgreSQL Database Integration

FastAPI REST Endpoints with Swagger UI docs

Customer Storefront UI (separate frontend)

Clean, modern web interface built with HTML, CSS, and JavaScript

🧩 Project Structure
product_catalog_manager/
│
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── database.py          # PostgreSQL connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── api/                 # API routes
│   ├── crud/                # Database operations
│
├── web/                     # Admin panel frontend
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│
├── store/                   # Customer storefront frontend
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│
├── requirements.txt
└── README.md

🚀 Local Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/<your-username>/product_catalog_manager.git
cd product_catalog_manager

2️⃣ Create a virtual environment
py -m venv .venv
.venv\Scripts\activate

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Start PostgreSQL locally

Ensure PostgreSQL is running and update your connection info in:

app/database.py

5️⃣ Run FastAPI
uvicorn app.main:app --reload

Then visit:

Admin Panel → http://127.0.0.1:8000/web

Swagger API Docs → http://127.0.0.1:8000/docs

Customer Storefront → http://127.0.0.1:8001 (run via separate script/config)

🧠 Notes

The project is fully functional in local development.

To make it live, a production setup (Render, PostgreSQL cloud instance, etc.) is required.

You can customize API endpoints and UI styling easily.
