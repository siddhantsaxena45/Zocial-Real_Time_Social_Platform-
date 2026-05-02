import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import analyticsRoute from "./routes/analytics.route.js"
import notificationRoute from "./routes/notification.route.js"
import { app, server } from "./socket/socket.js"

dotenv.config({});
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/analytics", analyticsRoute);
app.use("/api/v1/notification", notificationRoute);

app.get("/api/v1/ping", (req, res) => {
    res.send("Server is running");
});

server.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});