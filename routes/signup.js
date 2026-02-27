import { Router } from "express";
import { login } from "../controllers/login.js";
import { signup } from "../controllers/signup.js";
const Signuprouter = Router();

Signuprouter.post("/signup", signup).post("/login", login);
export default Signuprouter;