import bcrypt from "bcrypt";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import prisma from "../services/client.js";
import transporter from "../services/mailer.js";
import { signupVerify } from "../services/zodverify.js";


export async function signup(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter valid email and password" })
        }
        const result = signupVerify.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email: email,
                password: hash
            }
        });
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "mahaks070@gmail.com",
            subject: "Welcome to Progressly",
            text: "Thank you for joining Progressly!"
        })
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({ message: "User created successfully", token: token });


    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}





