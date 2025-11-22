# Application Architecture Documentation

This document describes the overall architecture of the application, including the database, server, and frontend structure.

---

## 1. Overview

The application follows a **multi-repo architecture**:

1. **Frontend Repository**: React (or any other framework) for the user interface.  
2. **Backend Repository**: Node.js + Express (or another framework) serving REST APIs.  
3. **Database**: PostgreSQL for persistent storage.

**Data Flow**:

User <--> Frontend Repo <--> Backend Repo <--> Database
> Note: The backend repo exposes API endpoints that the frontend consumes.

---

## 2. Repository Structure

### Frontend Repo

/frontend-repo
│
├─ src/
│   ├─ assets/
│   │
│   ├─ components/
│   │   ├─ Navbar.tsx
│   │   ├─ SaleCard.tsx
│   │   └─ BusinessCard.tsx
│   │
│   ├─ hooks/
│   │
│   ├─ pages/
│   │   ├─ Dashboard.tsx
│   │   ├─ Business.tsx
│   │   ├─ Sales.tsx
│   │   └─ Login.tsx
│   │
│   ├─ App.tsx
│   ├─ main.tsx
│   ├─ index.css
│   └─ package.json



### Backend Repo

/backend-repo
│
├─ controllers/
│   ├─ usersController.js
│   ├─ businessController.js
│   └─ salesController.js
│
├─ models/
│   ├─ user.js
│   ├─ business.js
│   └─ sales.js
│
├─ routes/
│   ├─ user.js
│   ├─ business.js
│   └─ sales.js
│
├─ app.js
├─ package.json
└─ .env # Environment variables for DB credentials

---

## 3. Deployment Considerations

- **Separate Deployments**:
  - Frontend can be deployed on Vercel, Netlify, or static server.  (Pending on Vercel)
  - Backend can be deployed on Heroku, Render, AWS, Supabase etc. (Pending on Supabase)
- **API URL**:
  - Frontend must point to the backend API URL (e.g., `https://api.myapp.com`).

---

## 4. Backend Architecture

- Manages database connections, business logic, and API endpoints.  
- **Endpoints**:
  - `/users` → CRUD for users  
  - `/business` → CRUD for businesses  
  - `/sales` → CRUD for sales  
- Database schema remains the same:
  - Tables: `users`, `business`, `sales`  
  - Foreign keys: `users.id → business.user_id`, `business.id → sales.business_id`

---

## 5. Frontend Architecture

- **Components** communicate with backend via REST API calls.  
- Example flow:
User Action → Component → API Call → Backend → Database → Response → Component → UI


---

## 6. Notes

- **Versioning**: Each repo has its own version control and CI/CD pipeline.  
- **Documentation**:
  - Documentation is located in its own repository.
- **Security**:
  - Backend handles authentication (JWT, session, etc.).
  - Frontend stores tokens securely (localStorage or cookies with HttpOnly).




