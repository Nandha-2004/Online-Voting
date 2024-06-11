// import Login from '../../Client/src/components/Sign/Login'
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require('multer')


const Voters = require('../Model/Voters');
const { checkLogin } = require("../Middleware/checkLogin");
const { decode } = require("punycode");

exports.createVoter = async (req, res) => {
    try {
        let newVoter;
        const hashedPassword = await bcrypt.hash(req.body.pass, 15);
        // console.log(req.file.filename);
        newVoter = new Voters({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            dob: req.body.dob,
            voterid: req.body.voterid,
            phone: req.body.phone,
            image: req.files[0].filename,
            email: req.body.email,
            pass: hashedPassword
        });
        // console.log(newVoter);
        // console.log(req.target.files[0]);
        await newVoter.save();
        return res.json({success:true});


    }
    catch (e) {
        return res.status(400).json({ success: false, message: e.message });
    }
}

exports.getVoters = async (req, res) => {
    const voter = await Voters.find();
    return res.json({ success: true, voter });
}

exports.getVoterbyID = async (req, res) => {
    // const token = req.header('Authorization').replace('Bearer ', '');
    // console.log(token)
    try {
        const voterID = req.params.id;
        // const decoded = jwt.verify(token, process.env.JWT_SEC);
        const voter = await Voters.findById(voterID);
        return res.json({ success: true, voter });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.updateVoter = async (req, res) => {
    try {
        const voter = await Voters.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!voter) {
            return res.status(404).json({
                success: false,
                message: 'Voter not found'
            })
        }
        return res.json({
            success: true,
            voter
        });
    }
    catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

// exports.deleteTask = async (req,res)=>{
//     try{
//         const task  = await Task.findByIdAndDelete(req.params.id);
//         if(!task){
//                 return res.status(404).json({
//                     success:false,
//                     message:'User not found'})
//             }
//             return res.json({
//                 success:true,
//                 task
//             });
//     }
//     catch(e){
//         return res.status(400).json({
//             success:false,
//             message:e.message
//         })
//     }
// }