Team Expenses App

A minimal real-world app for managing team expenses. Built with Next.js (App Router + SSR), Tailwind CSS, NestJS REST API, and PostgreSQL (or SQLite for speed). Supports JWT authentication (access + refresh tokens), user roles, and CRUD operations for expenses and categories.

Features

User Roles

Member: Manage personal expenses.

Admin: Manage all expenses and categories.

Auth

Email + password signup & login (JWT with refresh flow)

Password hashing (bcrypt/argon2)

Change password

Logout

Dashboard

KPI cards: Total spend, number of expenses, top category

Chart: Monthly spend (last 6 months)

Table: Recent expenses

Expenses CRUD

Create, edit, delete, view

Amount, currency, date, category, note

Categories (admin only)

List and create

Profile

View email, role

Change password

Security

JWT authentication with refresh token rotation

Sensitive fields excluded from responses

HTTP-only cookies for tokens

Stack

Frontend: Next.js (App Router, SSR), Tailwind CSS

Backend: NestJS, Prisma ORM, MySQL/PostgreSQL/SQLite

Authentication: JWT (access + refresh)

Database: Prisma + MySQL/PostgreSQL/SQLite

Getting Started (Local Development)
Prerequisites

Node.js >= 18

npm >= 9

MySQL or PostgreSQL (or SQLite)

Git

1. Clone the repository
git clone https://github.com/Mihigojordan/expense-tracker.git
cd expense-tracker

2. Setup environment variables

Create a .env file at the backend root:

DATABASE_URL="postgresql://my_user:mypassword@localhost:5432/Expense_tracker?schema=public"
JWT_SECRET_KEY = 7e9a65b71b6f5c9c1d244f3bb0f7e2c29d74d8c4b5c6a913a1d912fa9b4cf582e3f08c5d54f4bfc34f08c89b6f36c1e0fba2f7e98b9c7a9d6e2f1c48a9d7e3c91b28f92d5f4b0a6e9d2c48f7b93
CORS_ORIGIN = 'http://localhost:3000'


3. Install dependencies
# Backend
cd api
npm install

# Frontend
cd ./frontend
npm install

4. Run Prisma migrations & seed database
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data
npm run prisma:seed


Seed includes:

2 users (1 admin, 1 member)

5 categories (Travel, Meals, Office, Software, Other)

3 sample expenses spread over recent months

5. Run Backend
npm run start:dev


API runs on http://localhost:4000.

6. Run Frontend
cd ../frontend
npm run dev


Frontend runs on http://localhost:3000.

7. Test the App

Visit /register to create an account

Login at /login

Access /dashboard (SSR)

Members see only their expenses; admins see team data

Admin can manage categories

Test refresh flow, create/edit/delete expenses

API Endpoints

Auth

POST /auth/register → Register member

POST /auth/register-admin → Register admin

POST /auth/login → Login, returns { accessToken }, sets refresh cookie

POST /auth/refresh → Refresh token, returns { accessToken }

POST /auth/logout → Logout, clears refresh cookie

PATCH /auth/change-password → Change password (authenticated)

GET /auth/me → Get current user info

Expenses

GET /expenses → List expenses (current user / all if admin)

POST /expenses → Create expense

PATCH /expenses/:id → Update expense

DELETE /expenses/:id → Delete expense

Categories (admin only)

GET /categories → List all categories

POST /categories → Create category

Tech Notes

Prisma schema located at backend/prisma/schema.prisma

Models: User, Category, Expense

Enums: Role { ADMIN, MEMBER }

Relations: Expense.user -> User, Expense.category -> Category

Controllers:

AuthController

ExpensesController

CategoriesController

AppController (test route)

Guards: JwtAuthGuard, RolesGuard

DTOs and services included for validation and business logic

Authors

Mihigo Prince Jordan – Fullstack Developer
