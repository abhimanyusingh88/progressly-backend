import { Router } from "express";
import { ChangePassword, sendotp } from "../controllers/passchange.js";
import { verifyotp } from "../controllers/passOtpVerify.js";
const router = Router();
router.post("/sendotp", sendotp);
router.post("/verifyotp", verifyotp);
router.post("/changepassword", ChangePassword);
export default router;