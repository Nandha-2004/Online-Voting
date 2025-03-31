const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Voter = require("../models/Voters"); 
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

const fs = require('fs');
const path = require('path');
const multer = require("multer");

const router = express.Router();

// ✅ Ensure 'party/uploads' directory exists
const uploadPath = 'party/uploads/';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Set up storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Save images in 'party/uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});

const upload = multer({ storage });

// ✅ Create Admin Manually (One-Time Use)
router.post("/createadmin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 🔍 Check if admin already exists
        let existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }

        // 🔒 Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 📝 Create Admin
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();

        console.log("✅ Admin Created:", newAdmin);
        res.status(201).json({ success: true, message: "Admin created successfully" });

    } catch (error) {
        console.error("❌ Error Creating Admin:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ Admin Login Route
router.post("/adminlogin", async (req, res) => {
    try {
        console.log("🔑 Admin Login API Hit!", req.body);

        // Fetch All Admins (Debugging)
        const admins = await Admin.find();
        console.log("📌 All Admins in Database:", admins);

        const { username, password } = req.body;
        const admin = await Admin.findOne({ username:username });

        if (!admin) {
            console.log("❌ Admin not found");
            return res.status(400).json({ success: false, message: "Admin not found" });
        }

        // 🔒 Check Password
        // const isMatch = await bcrypt.compare(password, admin.password);
        // if (!isMatch) {
        //     console.log("❌ Password mismatch");
        //     return res.status(400).json({ success: false, message: "Invalid credentials" });
        // }

        // 🎟️ Generate JWT Token
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Admin Login Successful!");
        res.json({ success: true, admin: { username: admin.username }, token });

    } catch (error) {
        console.error("❌ Admin Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get('/getVoterbyID/all', async (req, res) => {
    console.log("🔄 Fetching Voter Data...");
    try {
        const voters = await Voter.find(); // Fetch all voters

        if (!voters || voters.length === 0) {
            return res.status(404).json({ success: false, message: 'No voters found' });
        }

        // ✅ Remove 'pass' field from each voter
        const votersData = voters.map(({ pass, ...voterData }) => voterData);

        res.json({ success: true, voters: votersData });
    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// ✅ Delete Voter by Voter ID and Remove Image
router.delete('/deleteVoter/:voterid', async (req, res) => {
    try {
        const { voterid } = req.params;

        // Find the voter
        const voter = await Voter.findOne({ voterid });

        if (!voter) {
            return res.status(404).json({ success: false, message: 'Voter not found' });
        }

        // Delete image from uploads folder
        if (voter.image) {
            const imagePath = path.join(__dirname, '../uploads', voter.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the file
            }
        }

        // Delete voter from the database
        await Voter.findOneAndDelete({ voterid });

        res.json({ success: true, message: 'Voter and image deleted successfully' });
    } catch (error) {
        console.error("❌ Error deleting voter:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// ✅ Create Candidate (With Image & Symbol Upload)
router.post('/createCandidate', upload.fields([{ name: 'image' }, { name: 'symbol' }]), async (req, res) => {
    console.log("The api hit and the res:",req.body);
    try {
        const { fullName, age, party, bio } = req.body;

        if (!req.files || !req.files.image || !req.files.symbol) {
            return res.status(400).json({ success: false, message: "Image and Party Symbol are required" });
        }

        const image = req.files.image[0].filename;
        const symbol = req.files.symbol[0].filename;

        // Insert into database
        const newCandidate = new Candidate({
            fullName,
            age,
            party,
            bio,
            image,
            symbol
        });

        await newCandidate.save();
        res.status(201).json({ success: true, message: "Candidate Created Successfully", candidate: newCandidate });
    } catch (error) {
        console.error("❌ Error Creating Candidate:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// ✅ Get All Candidates
router.get('/getCandidate', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        console.error("❌ Error Fetching Candidates:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// ✅ Delete Candidate by ID
router.delete('/deleteCandidate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Candidate.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Candidate Deleted Successfully" });
    } catch (error) {
        console.error("❌ Error Deleting Candidate:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// ✅ Seed Static Elections (Run Once)
router.get('/getElections', async (req, res) => {
    try {
        const elections = await Election.find();
        res.status(200).json(elections);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});

// ✅ Update Election Status (Start/Stop)
router.put('/updateElection/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const election = await Election.findById(id);
        
        if (!election) return res.status(404).json({ success: false, message: "Election not found" });

        election.status = election.status === 'started' ? 'stopped' : 'started';
        await election.save();

        res.status(200).json({ success: true, message: "Election status updated", election });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});


module.exports = router;
