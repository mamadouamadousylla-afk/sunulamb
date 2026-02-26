# SunuLamb Backend API

Backend API for the SunuLamb ticketing platform for Senegalese wrestling events.

## Description

This is the backend API for the SunuLamb application, built with Node.js, Express, and MongoDB. It handles user authentication, event management, ticketing, and payment processing.

## Features

- User authentication and authorization
- Event management (create, read, update, delete)
- Ticket management and validation
- Payment processing integration
- Role-based access control (User, Organizer, Admin)

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example` and add your environment variables
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user details
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:resettoken` - Reset password

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user (Admin only)
- `POST /api/users` - Create a user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create an event (Organizer/Admin only)
- `PUT /api/events/:id` - Update event (Organizer/Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `GET /api/events/organizer/:organizerId` - Get events by organizer

### Tickets
- `GET /api/tickets` - Get all tickets (Admin only)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create a ticket
- `PUT /api/tickets/:id` - Update ticket (Admin only)
- `DELETE /api/tickets/:id` - Delete ticket (Admin only)
- `PUT /api/tickets/validate/:qrCode` - Validate ticket (Organizer/Admin only)
- `GET /api/tickets/user/:userId` - Get tickets by user
- `GET /api/tickets/event/:eventId` - Get tickets by event

### Payments
- `GET /api/payments` - Get all payments for user
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get single payment
- `PUT /api/payments/refund/:id` - Refund payment (Admin only)

## Environment Variables

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `JWT_COOKIE_EXPIRE` - JWT cookie expiration days
- `WAVE_API_KEY` - Wave API key
- `ORANGE_MONEY_API_KEY` - Orange Money API key
- `FREE_MONEY_API_KEY` - Free Money API key
- `SMTP_HOST` - SMTP host
- `SMTP_PORT` - SMTP port
- `SMTP_EMAIL` - SMTP email
- `SMTP_PASSWORD` - SMTP password
- `FROM_EMAIL` - From email address
- `FROM_NAME` - From name
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Running Tests

Coming soon...

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT