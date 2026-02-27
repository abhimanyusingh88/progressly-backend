import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../services/client.js";
import { signupVerify } from "../services/zodverify.js";

export async function login(req, res) {
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
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "please enter valid credintials" });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({ message: "User logged in successfully", token: token });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}