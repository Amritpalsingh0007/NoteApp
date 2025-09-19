# 📝 Multi-Tenant SaaS Notes Application

This repository contains my submission for the **Multi-Tenant SaaS Notes Application** assessment.  
The project includes both **backend (Express + MongoDB)** and **frontend (React + Vite)**, deployed on **Vercel**.

---

## 🚀 Features

- **Multi-Tenancy**
  - Supports **Acme** and **Globex** tenants.
  - Strict tenant isolation — no tenant can access another tenant’s data.
  - Implementation: **Shared schema with tenant ID column** approach for simplicity and efficiency.

- **Authentication & Authorization**
  - JWT-based authentication.
  - Roles:
    - **Admin** → can invite users and upgrade subscriptions.
    - **Member** → can create, view, edit, delete notes.
  - Predefined test accounts:
    - `admin@acme.test` (Admin, tenant: Acme)  
    - `user@acme.test` (Member, tenant: Acme)  
    - `admin@globex.test` (Admin, tenant: Globex)  
    - `user@globex.test` (Member, tenant: Globex)  
    - Password for all accounts: **`password`**

- **Subscription Plans**
  - **Free Plan** → limited to 3 notes per tenant.
  - **Pro Plan** → unlimited notes.
  - Upgrade endpoint:  
    ```
    POST /tenants/:slug/upgrade
    ```
    (Admin only, lifts note limit immediately)

- **Notes API (CRUD)**
  - `POST /notes` → Create note  
  - `GET /notes` → List all notes for tenant  
  - `GET /notes/:id` → Get single note  
  - `PUT /notes/:id` → Update note  
  - `DELETE /notes/:id` → Delete note  

- **Deployment**
  - Backend and frontend hosted on **Vercel**.
  - CORS enabled for automated tests and dashboard access.
  - Health check endpoint:  
    ```
    GET /health → { "status": "ok" }
    ```

- **Frontend**
  - Minimal React app with login, notes listing/creation/deletion.
  - Upgrade flow shown when Free plan reaches note limit.

- **Extra Utility**
  - **`POST /reset`** (Admin only):  
    Resets all tenants to Free plan, clears notes, and resets `notes_count` to 0.  
    👉 Useful for re-running automated tests.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, JWT, Mongoose, MongoDB Atlas
- **Frontend**: React (Vite), TailwindCSS
- **Hosting**: Vercel (frontend + backend)

---

## 🔗 Useful Links

- 📄 **Postman Collection**: [API Endpoints](https://galactic-sunset-7310891.postman.co/workspace/Personal-Workspace~286a27d2-13f2-4a94-9119-34b702f83fd4/collection/47653117-5abeff84-17f6-4186-beae-61e8ab7cceae?action=share&creator=47653117)  
- 🌐 **Frontend (Vercel)**: [Deployed App](https://note-app-front-azure.vercel.app/)  
- 🌐 **Backend (Vercel)**: [API Base URL](https://note-app-jade-one.vercel.app/)  

---

## 🧑‍💻 Running Locally

### 1. Clone repo
```bash
git clone https://github.com/Amritpalsingh0007/NoteApp.git
cd NoteApp
````

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create `.env` in `Backend/`:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongo_uri
```
👉 **Note**: Install and setup mongodb locally and provides its uri

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../Frontend
npm install
```
Create `.env` in `Frontend/`:

```env
VITE_BASE_URL=http://localhost:3000
```
```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

## ✅ Test Accounts

* **Admin (Acme)** → `admin@acme.test` / `password`
* **User (Acme)** → `user@acme.test` / `password`
* **Admin (Globex)** → `admin@globex.test` / `password`
* **User (Globex)** → `user@globex.test` / `password`

---

## 📡 API Endpoints Overview

| Method | Endpoint                 | Description                 | Role    |
| ------ | ------------------------ | --------------------------- | ------- |
| GET    | `/health`                | Health check                | Public  |
| POST   | `/auth/v1/login`         | Login with email & password | Public  |
| POST   | `/notes`                 | Create a note               | Member+ |
| GET    | `/notes`                 | List notes (per tenant)     | Member+ |
| GET    | `/notes/:id`             | Get single note             | Member+ |
| PUT    | `/notes/:id`             | Update note                 | Member+ |
| DELETE | `/notes/:id`             | Delete note                 | Member+ |
| POST   | `/tenants/:slug/upgrade` | Upgrade tenant to Pro       | Admin   |
| POST   | `/reset`                 | Reset all tenants & notes   | Admin   |
| POST   | `/auth/v1/addUser`       | This adds user to tenants   | Admin   |

---

## 🧪 Testing & Validation

The app is designed to pass automated validation:

* ✅ Health endpoint works
* ✅ Login works for all test accounts
* ✅ Tenant isolation enforced
* ✅ Role restrictions enforced (Members can’t upgrade tenants)
* ✅ Free plan note limit enforced
* ✅ Upgrade flow removes note limit instantly
* ✅ CRUD operations tested successfully
* ✅ Frontend integrated & deployed

---

## ⚠️ Notes

* MongoDB Atlas is **open during the assessment period only** for ease of validation.
* Please use only the provided test accounts.
* The `/reset` route is provided to simplify re-testing.

---

#Error codes used in project:
- 4031 : user have reached the limit for creating the notes
- 4032 : note id was not provided
- 4033 : user of a tenant tried to access different tenant note
- 4034 : user role is not valid