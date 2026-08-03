import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import preferenceRoutes from "./routes/preferences.js";

import authRoutes from "./routes/auth.js";

const app = express();

// Allow frontend to communicate with backend
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

// Parse incoming JSON requests
app.use(express.json());

// Configure user sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: false,

      httpOnly: true,

      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Initialize Passport authentication
app.use(passport.initialize());

// Enable persistent login sessions
app.use(passport.session());

app.use((req, res, next) => {
  console.log("SESSION USER:", req.user);

  next();
});

// Authentication routes
app.use("/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Palate API running");
});

app.use("/preferences", preferenceRoutes);

export default app;
