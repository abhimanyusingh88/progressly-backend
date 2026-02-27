import cors from "cors";
import 'dotenv/config';
import express from "express";
import passchangeRouter from "./routes/passchange.js";
import Signuprouter from "./routes/signup.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/user", Signuprouter)
app.use("/user/passchange", passchangeRouter);


app.listen(process.env.PORT, () => {
    console.log("Server started on port 3000");
});
