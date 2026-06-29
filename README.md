# VBD Education Services — Full Stack Portal

A multi-school e-commerce platform for managing school uniforms, books, and educational supplies. Built with React, Node.js/Express, and PostgreSQL (Prisma).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express 5, Prisma ORM |
| Database | PostgreSQL (Neon cloud) |
| Auth | JWT + bcrypt |

---

## Project Structure

```
VBD/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/  # Axios API client
│   │   └── context/
│   └── .env.example
├── backend/           # Express + Prisma backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── config/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env.example
├── docker-compose.yml
└── package.json       # Root monorepo scripts
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech) — free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/VBD.git
cd VBD
```

### 2. Set up Backend environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and fill in your DATABASE_URL and JWT_SECRET
```

### 3. Set up Frontend environment
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env — set VITE_API_URL if using a remote backend
```

### 4. Install dependencies
```bash
npm install   # installs root + frontend + backend via postinstall
```

### 5. Set up the database
```bash
cd backend
npx prisma migrate deploy   # apply migrations
npx prisma generate         # generate Prisma Client
npm run seed                # seed demo data (optional)
cd ..
```

### 6. Run locally
```bash
npm run dev           # starts both backend (:5000) and frontend (:5173)
# or separately:
npm run dev:backend
npm run dev:frontend
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRE=30d
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | 🔒 JWT |
| GET | `/api/schools` | List all schools | Public |
| GET | `/api/products` | List products | Public |
| POST | `/api/orders` | Create order | 🔒 JWT |
| GET | `/api/orders` | List orders | 🔒 JWT |
| GET | `/api/cms` | CMS content | Public |

---

## Database Schema

Models: `User`, `School`, `Product`, `Order`, `OrderItem`, `Notification`, `CMS`

Run `npx prisma studio` inside the `backend/` folder to browse your database visually.

---

## Roles

| Role | Access |
|---|---|
| `VBT_SUPER_ADMIN` | Full access to all schools |
| `SUPER_ADMIN` | School group admin |
| `SCHOOL_ADMIN` | Manages own school |
| `PARENT` / `STUDENT` | Browse & order products |

---

## License

MIT
