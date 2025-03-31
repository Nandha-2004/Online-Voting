const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const voterRoutes = require("./routes/voters"); // ✅ Correct path
const adminRoutes = require("./routes/admin"); // ✅ Correct path

dotenv.config();
const app = express();

const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Middleware
console.log("✅ MongoDB Connecteddfsdf");
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/party/uploads', express.static('party/uploads')); // Serve images from new folder
app.use("/voter", voterRoutes); // ✅ Attach Voter Routes
app.use("/admin", adminRoutes); // ✅ Attach Admin Routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
