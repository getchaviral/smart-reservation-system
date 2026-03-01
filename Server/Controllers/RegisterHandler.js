import express from 'express'
import User from '../Modals/Users.js';
import bcrypt from 'bcrypt'

const RegisterHandler = express();

RegisterHandler.post('/register' , async (req,res)=>{
    
    const { username, email, password} = req.body;
    const safeName = username?.trim();
    const safeEmail = email?.trim().toLowerCase();

    if (!safeName || safeName.length < 2) {
        return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!safeEmail || !emailPattern.test(safeEmail)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    try {
        const existing = await User.findOne({ email: safeEmail });
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hash = await bcrypt.hash(password, 10);

        await User.create({
            name: safeName,
            email: safeEmail,
            password: hash
        });

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Registration failed" });
    }

})


export default RegisterHandler
