import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../services/client.js";
import transporter from "../services/mailer.js";
import { generateOTP } from "../services/otpgenerator.js";
import { passVerify } from "../services/zodverify.js";

export async function sendotp(req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Please enter valid email" });
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) return res.status(404).json({ message: "User not found" });
        const otp = generateOTP();
        console.log(otp);
        const hashedOtp = await bcrypt.hash(otp, 10);
        await prisma.otp.create({
            data: {
                otp: hashedOtp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                userId: user.id
            }
        })
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for resetting your account password at progressly",
            text: `your one time password for resetting password is ${otp}, valid for only 5 minutes`

        })
        return res.status(200).json({ message: "OTP sent successfully" });


    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}



/////////////////////////////////////

export async function ChangePassword(req, res) {
    try {
        const { email, password1, password2, token } = req.body;
        if (!token) return res.status(400).json({ message: "Unauthorized access denied" });
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) return res.status(400).json({ message: "Session expired, please try again later" });

        if (!password1 | !password2) return res.status(400).json({ message: "Please enter valid pasword" });
        if (password1 !== password2) return res.status(400).json({ message: "Password does not match" });
        const resultingPass = passVerify.safeParse(password1);
        if (!resultingPass.success) return res.status(400).json({ message: "Invalid password" });
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) return res.status(404).json({ message: "User not found" });
        const hash = await bcrypt.hash(password1, 10);
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: hash
            }
        })
        await prisma.otp.deleteMany({
            where: {
                userId: user.id
            }
        })
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }

}