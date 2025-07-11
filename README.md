# 🚀 PrismaCart – Modern E-Commerce Backend with TypeScript, PostgreSQL & JWT Auth

Welcome to **PrismaCart** — a scalable, real-world e-commerce backend built for speed, structure, and security. Whether you're building cross-platform apps with **Flutter** or managing a high-scale frontend, PrismaCart is plug-and-play ready.

---

## 🧱 Tech Stack

| Tech           | Purpose                                  |
|----------------|------------------------------------------|
| 🟦 TypeScript | Strong types = fewer runtime bugs        |
| ⚙️ Express.js | Fast, minimalist web framework           |
| 🌐 Prisma     | Type-safe ORM for PostgreSQL             |
| 🐘 PostgreSQL | Robust relational database               |
| 🔐 JWT        | Authentication & authorization           |
| 🧠 Redis      | Caching & token/session optimization     |

---

## 🔐 Authentication & Security Features

- **JWT Access Tokens** – Valid for 15 minutes
- **Refresh Tokens** – Stored securely in DB, valid for 7 days
- **RBAC** – Role-based access (Admin, Seller, Customer)
- **Logout Flow** – Deletes refresh token from DB
- **Token Rotation** – New access token issued via refresh route
- **Redis Caching** – Speed up repeated DB queries
- **Rate Limiting (Optional)** – Prevent refresh token abuse

---

## 📦 Features

- ✅ Full **CRUD APIs** for Products, Categories, and Users
- ✅ Modular **MVC Structure**
- ✅ Role-restricted routes using middleware
- ✅ Category filtering, price logic, and data validations
- ✅ Production-ready JWT + Refresh Token Auth Flow
- ✅ Redis-backed cache layer for performance boost
- ✅ Secure, scalable codebase designed for mobile (especially **Flutter**)

---

## 📁 Project Structure

/src
├── controllers // Route logic

├── routes // Express routes

├── middleware // Auth, role checks, rate limiting

├── services // Business logic, token service, cache

├── utils // JWT helpers, custom error handling

├── prisma // Prisma schema + DB setup

└── index.ts // Main Express setup



## 🔄 Refresh Token Logic

- Access token expires in 15 minutes.
- Refresh token is used to request a new access token.
- Optional: apply **rate limit** to prevent abuse.
- On logout, refresh token is deleted from the database.

---

## 🚀 Getting Started

```bash
git clone https://github.com/VaibhavJangir26/prismacart.git
cd prismacart
npm install

# Setup .env with your DB URL, JWT secrets, etc.

npx prisma generate
npx prisma migrate dev --name init

npm run dev
