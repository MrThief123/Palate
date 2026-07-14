import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";

import authRoutes from "./routes/auth.js";


const app = express();


// Allow frontend to communicate with backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


// Parse incoming JSON requests
app.use(
  express.json()
);


// Configure user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: false, // Set true when using HTTPS in production
    },
  })
);


// Initialize Passport authentication
app.use(
  passport.initialize()
);


// Enable persistent login sessions
app.use(
  passport.session()
);


// Authentication routes
app.use(
  "/auth",
  authRoutes
);


// Health check route
app.get(
  "/",
  (req, res) => {
    res.send("Palate API running");
  }
);


export default app;