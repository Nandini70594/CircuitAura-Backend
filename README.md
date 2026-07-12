# CircuitAura Backend

## Overview

CircuitAura Backend is the server-side API for the CircuitAura electronics startup. It provides secure authentication, content management for products and DIY kits, order processing, learning resources, file uploads, and email-based password reset support for the web application.

## Features

- User Authentication
- JWT Authorization
- Product Management
- DIY Kit Management
- Order Management
- Learning Resources
- Image/File Uploads
- Password Reset
- Email Integration
- REST API

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MySQL
- Supabase

### Services

- JWT Authentication
- Multer
- Resend Email API


## Installation

```bash
git clone https://github.com/Nandini70594/CircuitAura-Backend.git
cd CircuitAura-Backend
npm install
npm start
```

If nodemon is available, you can start the development server with:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
PORT=5000

JWT_SECRET=your_jwt_secret

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

RESEND_API_KEY=your_resend_api_key

MYSQL_HOST=your_host
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```
> **Note:** Create a `.env` file in the project root and configure these environment variables before running the backend.

## API Modules

The backend is organized into modular REST APIs for the following functionalities:

- Authentication
- Products
- DIY Kits
- Orders
- Learning Resources
- File Uploads
- Password Reset

## Error Handling

The API returns standard HTTP status codes for validation, authentication, authorization, and server-side failures. Missing or invalid tokens return 401 or 403 responses, missing resources return 404, and unexpected backend errors are handled through a centralized error middleware.

## Available Scripts

```json
## Available Scripts

- `npm start` — Starts the production server.
- `npm run dev` — Starts the development server using Nodemon.
```

## Deployment

The backend can be deployed on cloud platforms such as Render, Railway, or Koyeb with the required environment variables configured.

## Future Enhancements

Potential improvements for the backend include:

- Payment API integration
- Inventory management
- Order tracking
- Product reviews
- Admin analytics
