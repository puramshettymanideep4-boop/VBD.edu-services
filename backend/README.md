# VBD Full Stack Backend

This is the Node.js/Express backend for the VBD Education Services platform.

## Architecture
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Architecture Pattern:** MVC (Models, Views/Routes, Controllers)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Environment Variables:
Copy `.env.example` to `.env` and fill in the values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster.mongodb.net/vbd
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

3. Seed the Database:
To populate initial schools, products, and admin users:
```bash
npm run seed
```

## Running Locally

To run the development server (with nodemon):
```bash
npm run dev
```

To run the production server:
```bash
npm start
```

## API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/me` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### School Endpoints
- `GET /api/schools` - Get all schools
- `GET /api/schools/:id` - Get specific school
- `POST /api/schools` - Create a school (Super Admin)
- `PUT /api/schools/:id` - Update a school (Super Admin)
- `DELETE /api/schools/:id` - Delete a school (Super Admin)

### Product Endpoints
- `GET /api/products` - Get products (Supports `?schoolId`, `?category`, `?search`)
- `POST /api/products` - Create a product (Admin)
- `PUT /api/products/:id` - Update a product (Admin)
- `DELETE /api/products/:id` - Delete a product (Admin)

### Order Endpoints
- `POST /api/orders` - Place an order (Protected)
- `GET /api/orders` - View orders (Restricted by Role)
- `GET /api/orders/:id` - View order details (Restricted by Role)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Notification Endpoints
- `GET /api/notifications` - Get user notifications (Protected)
- `POST /api/notifications` - Create notification (Super Admin)
- `PUT /api/notifications/:id/read` - Mark notification read (Protected)

### CMS Endpoints
- `GET /api/cms` - Get website content
- `PUT /api/cms` - Update website content (Super Admin)
