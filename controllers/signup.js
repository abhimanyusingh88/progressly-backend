import bcrypt from "bcrypt";
import crypto from "crypto";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import prisma from "../services/client.js";
import transporter from "../services/mailer.js";
import { passVerify, signupVerify } from "../services/zodverify.js";


export async function signup(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please enter valid email" })
        }
        const result = signupVerify.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }


        await prisma.tempOtp.deleteMany({
            where: {
                email: email
            }
        })
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        await prisma.tempOtp.create({
            data: {
                otp: hashedOtp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                email: email
            }
        })
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP for signing up at progressly",
            text: `your one time password for signing up is ${otp}, valid for only 5 minutes`
        })
        return res.status(200).json({ message: "OTP sent successfully" });



    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


////////////////////////////////////////////////////////////////////

export async function verifyEmail(req, res) {
    try {
        const { otp, email } = req.body;
        if (!otp) return res.status(400).json({ message: "Please enter valid otp" });

        const tempOtp = await prisma.tempOtp.findFirst({
            where: {
                email: email
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        if (!tempOtp) return res.status(404).json({ message: "OTP not found" });
        if (tempOtp.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });
        const isValid = await bcrypt.compare(otp, tempOtp.otp);
        if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

        await prisma.tempOtp.updateMany({
            where: { email: email },
            data: { verified: true }
        });
        return res.status(200).json({ message: "OTP verified successfully" });



    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }

}


/////////////////////////////////////////////////////////

export async function createUser(req, res) {
    try {
        const { password1, password2, email } = req.body;

        const tempUser = await prisma.tempOtp.findFirst({
            where: {
                email: email
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        if (tempUser.verified !== true) return res.status(400).json({ message: "Unauthorized user acess denied, please verify your email first" });


        if (password1 !== password2) return res.status(200).json({ message: "entered passwords must be same" })
        const verify = passVerify.safeParse({ password: password1 });

        if (!verify.success) return res.status(404).json({ message: verify.error.issues[0].message });
        await prisma.tempOtp.deleteMany({
            where: {
                email: email
            }
        })
        const hashedPassword = await bcrypt.hash(password1, 10);
        await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Signup successful!",
            text: "You have successfully signed up in progressly, its time to boost your progress."
        })
        return res.status(200).json({ message: "User successfully created", token: token })
    }
    catch (err) {
        console.log(err);
        return res.status(404).json({ message: "Something went wrong while creating the user" });
    }
}






