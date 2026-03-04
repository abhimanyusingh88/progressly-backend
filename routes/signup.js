import { Router } from "express";
import { login } from "../controllers/login.js";
import { createUser, signup, verifyEmail } from "../controllers/signup.js";
const Signuprouter = Router();

Signuprouter.post("/signup", signup).post("/verify", verifyEmail).post("/createuser", createUser);
Signuprouter.post("/login", login);
export default Signuprouter;