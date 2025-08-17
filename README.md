# MERN Stack Authentication App with Email Verification

A complete authentication system built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring email verification, OTP functionality, and secure user management.

## Features

### Backend Features
- **Express.js Server** with MongoDB connection using Mongoose
- **User Authentication** with JWT tokens
- **Email Verification** using OTP (One-Time Password)
- **Password Security** with bcrypt hashing
- **Rate Limiting** for API endpoints
- **Cron Jobs** for automatic cleanup and retry limit resets
- **Input Validation** using express-validator
- **Error Handling** with proper HTTP status codes

### Frontend Features
- **React Application** built with Vite
- **Responsive Design** using Tailwind CSS
- **Protected Routes** with authentication guards
- **Form Validation** and error handling
- **User Profile Management** with edit capabilities
- **Password Update** functionality
- **Modern UI/UX** with loading states and feedback

### Security Features
- **JWT Token Authentication**
- **Password Retry Limits** (3 attempts before 3-hour block)
- **Automatic Block Reset** every 3 hours
- **Email Verification Required** for account activation
- **Secure Password Storage** with bcrypt
- **API Rate Limiting** to prevent abuse

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email service (or other SMTP provider)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mern-auth-app
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/mern_auth_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important Notes:**
- For Gmail, you'll need to generate an "App Password" in your Google Account settings
- Use a strong, unique JWT secret
- The MongoDB URI should point to your MongoDB Atlas cluster

## Running the Application

### Development Mode

1. **Start Backend Server**
```bash
npm run dev
```
The server will run on `http://localhost:5000`

2. **Start Frontend Development Server**
```bash
npm run client
```
The React app will run on `http://localhost:3000`

### Production Mode

1. **Build Frontend**
```bash
npm run build
```

2. **Start Production Server**
```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /send-otp` - Send OTP to email for verification
- `POST /verify-otp` - Verify OTP and complete user registration
- `POST /login` - User login with email and password

### User Routes (`/api/user`)

- `GET /profile` - Get authenticated user profile (Protected)
- `PUT /update-password` - Update user password (Protected)
- `PUT /update-profile` - Update user profile information (Protected)

## Database Models

### User Model
- `userId` - Unique identifier (auto-generated)
- `firstName`, `lastName` - User's full name
- `email` - Unique email address
- `mobileNumber` - Contact number
- `password` - Hashed password
- `isEmailVerified` - Email verification status
- `passwordRetryCount` - Failed login attempts counter
- `isBlocked` - Account block status
- `blockedUntil` - Block expiration timestamp

### OTP Model
- `email` - Email address for OTP
- `otp` - 6-digit verification code
- `expiresAt` - OTP expiration timestamp
- `isUsed` - OTP usage status

## Frontend Components

- **AuthContext** - Authentication state management
- **Navbar** - Navigation with authentication status
- **Login** - User login form
- **Signup** - User registration with OTP verification
- **Home** - Protected dashboard with user profile
- **LoadingSpinner** - Loading state component

## Security Features

### Password Protection
- Passwords are hashed using bcrypt with salt rounds of 12
- Minimum password length of 6 characters
- Password retry limits with automatic blocking

### JWT Security
- Tokens expire after 24 hours (configurable)
- Secure token storage in localStorage
- Automatic token validation on protected routes

### Rate Limiting
- API rate limiting for POST and PUT requests
- Configurable limits and time windows
- Prevents abuse and brute force attacks

### Email Verification
- OTP-based email verification required for account activation
- OTP expires after 10 minutes
- Automatic cleanup of expired OTPs

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Deploy automatically on push to main branch

### Frontend Deployment (Netlify/Vercel)

1. Build the frontend: `npm run build`
2. Deploy the `client/dist` folder to your preferred platform
3. Set environment variables for API endpoints

### Environment Variables for Production

```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_app_password
FRONTEND_URL=https://your-frontend-domain.com
```

## Testing

### Backend Testing
```bash
# Test server health
curl http://localhost:5000/api/health

# Test rate limiting
for i in {1..110}; do curl -X POST http://localhost:5000/api/auth/login; done
```

### Frontend Testing
- Test user registration flow
- Verify email OTP functionality
- Test login with valid/invalid credentials
- Test password retry limits
- Verify protected route access

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB URI in environment variables
   - Check network access and IP whitelist

2. **Email Not Sending**
   - Verify Gmail app password
   - Check email service configuration
   - Ensure 2FA is enabled on Gmail account

3. **JWT Token Issues**
   - Verify JWT secret in environment
   - Check token expiration settings

4. **CORS Errors**
   - Verify CORS configuration in server
   - Check frontend proxy settings

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

## Changelog

### Version 1.0.0
- Initial release with complete authentication system
- Email verification with OTP
- User profile management
- Password security features
- Rate limiting and security measures
