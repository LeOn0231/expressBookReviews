const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session setup
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if session contains token
    if (!req.session.authorization || !req.session.authorization.token) {
      return res.status(403).json({ message: "No token provided. Authentication failed." });
    }
  
    const token = req.session.authorization.token;
  
    // Verify the token
    jwt.verify(token, "access", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token. Authentication failed." });
      }
  
      // If verification successful, attach username to request
      req.user = user;
      next();
    });
  });
  

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
