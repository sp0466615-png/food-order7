require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const authRoutes = require("./routes/auth");

const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

/* Session */
app.use(
  session({
    name: "foodapp.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 86400000, // 1 day
    },
  })
);

/* MongoDB */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  });

/* Routes */
app.use("/", authRoutes);
app.get("/", (req, res) => res.redirect("/login"));

/* Server */
const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
