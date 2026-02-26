const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set security headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  // Prevent the browser from trying to access devtools-related resources
  if (req.url.includes('.well-known')) {
    return res.status(404).send('Not Found');
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Serve the test API page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SunuLamb API Server</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
                text-align: center;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #1B8B3D;
            }
            .status {
                background-color: #d4edda;
                color: #155724;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .endpoints {
                text-align: left;
                margin: 20px 0;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✓ SunuLamb API Server Running!</h1>
            <div class="status">
                <p><strong>Server Status:</strong> Operational</p>
                <p><strong>Port:</strong> 5001</p>
                <p><strong>Environment:</strong> Development</p>
            </div>
            <p>Welcome to the SunuLamb Senegalese Wrestling Ticketing Platform API!</p>
            
            <div class="endpoints">
                <h3>Available API Endpoints:</h3>
                <ul>
                    <li><strong>Authentication:</strong> GET /api/auth/me, POST /api/auth/login, POST /api/auth/register</li>
                    <li><strong>Events:</strong> GET /api/events, GET /api/events/:id, POST /api/events</li>
                    <li><strong>Tickets:</strong> GET /api/tickets, GET /api/tickets/:id, POST /api/tickets</li>
                    <li><strong>Payments:</strong> GET /api/payments, POST /api/payments</li>
                </ul>
            </div>
            <p>Test the API using the endpoints above or visit <a href="/api/events">/api/events</a> to see sample data.</p>
        </div>
    </body>
    </html>
  `);
});

// Error handler middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});