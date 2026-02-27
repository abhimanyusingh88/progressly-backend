import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../services/client.js";

export async function verifyotp(req, res) {
    try {
        const { otp, email } = req.body;
        if (!otp) return res.status(400).json({ message: "Please enter valid otp" });
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) return res.status(404).json({ message: "User not found" });
        const UserOtp = await prisma.otp.findFirst({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        if (!UserOtp) return res.status(404).json({ message: "OTP not found" });
        const isValid = await bcrypt.compare(otp, UserOtp.otp);
        if (!isValid) return res.status(400).json({ message: "Invalid OTP" });
        if (UserOtp.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });

        return res.status(200).json({ message: "OTP verified successfully", token: token });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }

}