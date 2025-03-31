const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Voter = require("../models/Voters"); 
const E_Result = require('../models/E_Result'); // Election Result Model
const Candidate = require('../models/Candidate');  // Ensure correct path

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const app = express();

// Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const verifyToken = (req, res, next) => {
    const token = req.cookies?.authToken; // ✅ Safe access using optional chaining

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        req.voterid = decoded.voterid;
        req.userType = decoded.userType;  
        next();
    });
};

// ✅ Voter Registration (Now with Image Upload)
router.post("/createVoter", upload.single("image"), async (req, res) => {
    try {
        console.log("📩 Voter Registration Request Receiveds:", req.body, req.file);
        
        const { firstName, lastName, age, city, state, dob, voterid, phone, email, pass } = req.body;
        const image = req.file ? req.file.filename : null; // Store only filename

        if (!firstName || !lastName || !age || !city || !state || !dob || !voterid || !phone || !email || !pass) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        const newVoter = new Voter({
            firstName, lastName, age, city, state, dob, voterid, phone, email,
            pass: hashedPassword, 
            image  // Save only the image filename
        });

        await newVoter.save();
        console.log("✅ Voter Created Successfully");
        res.status(201).json({ success: true, message: "Voter Created Successfully" });

    } catch (error) {
        console.error("❌ Error in /createVoter:", error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});


// ✅ Voter Login Route
router.post("/login", async (req, res) => {
    try {
        console.log("🔑 Voter Login API Hit!", req.body);
        const { username, password } = req.body;

        const voter = await Voter.findOne({ email: username });
        if (!voter) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, voter.pass);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const userType = "user";  // Set userType dynamically if needed

        // 🎟️ Generate JWT Token
        const token = jwt.sign(
            { voterid: voter.voterid, userType },  // ✅ Include userType in token
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        // 🍪 Store JWT in HTTP-Only Cookie
        res.cookie("authToken", token, {
            httpOnly: true,  
            secure: true,    
            sameSite: "Strict", 
            maxAge: 2 * 24 * 60 * 60 * 1000 
        });

        console.log("✅ Login Successful!");
        res.json({ success: true, voterid: voter.voterid, userType });  // ✅ Send userType in response

    } catch (error) {
        console.error("❌ Voter Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


// ✅ Get Voter Details by ID (Protected Route)
router.get('/getVoterbyID/:voterID', verifyToken, async (req, res) => {
    try {
        const voter = await Voter.findOne({ voterid: req.params.voterID });
        if (!voter) {
            return res.status(404).json({ success: false, message: 'Voter not found' });
        }
        const { pass, ...voterData } = voter._doc;
        res.json({ success: true, voter: voterData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// ✅ Update Voter Profile with Image Deletion
router.put("/updateVoter/:voterid", upload.single("image"), async (req, res) => {
    try { 
        const voterid = req.params.voterid;
        console.log("🔄 Update Request for:", voterid, req.body, req.file);

        const { firstName, lastName, dob, phone, email, pass } = req.body;
        let updatedData = { firstName, lastName, dob, phone, email };

        // ✅ Find existing voter
        const existingVoter = await Voter.findOne({ voterid: voterid });
        if (!existingVoter) {
            return res.status(404).json({ success: false, message: "Voter not found" });
        }

        // ✅ If password is updated, hash it
        if (pass) {
            updatedData.pass = await bcrypt.hash(pass, 10);
        }

        // ✅ Remove old image if a new one is uploaded
        if (req.file) {
            if (existingVoter.image) {
                const oldImagePath = path.join(__dirname, "../uploads", existingVoter.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete old image
                }
            }
            updatedData.image = req.file.filename;
        }

        // ✅ Update voter profile
        const updatedVoter = await Voter.findOneAndUpdate(
            { voterid: voterid },
            { $set: updatedData },
            { new: true }
        );

        console.log("✅ Voter Profile Updated Successfully");
        res.status(200).json({ success: true, message: "Profile updated", voter: updatedVoter });

    } catch (error) {
        console.error("❌ Error updating voter profile:", error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});

router.post('/e_vote', verifyToken, async (req, res) => {
    console.log("Request received:", req.body);

    try {
        const { voterId, candidateId } = req.body;

        if (!voterId || !candidateId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const voter = await Voter.findOne({ voterid: voterId });
        if (!voter) {
            return res.status(404).json({ message: "Voter not found" });
        }

        if (voter.voteStatus === "Voted") {
            return res.status(400).json({ message: "You have already voted" });
        }

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        // Increment the voting_count for the candidate
        candidate.voting_count += 1;
        await candidate.save();

        // Update the voter status to "Voted"
        await Voter.findOneAndUpdate({ voterid: voterId }, { voteStatus: "Voted" });

        return res.status(200).json({ message: "Vote successfully recorded" });

    } catch (error) {
        console.error("Error in voting:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;
