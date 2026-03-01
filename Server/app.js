import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import RegisterHandler from "./Controllers/RegisterHandler.js";
import LoginHandler from "./Controllers/LoginHandler.js";
import photos from "./Controllers/Cloudinary.js";
import AddReserve from "./Controllers/AddReserve.js";
import YourReserves from "./Controllers/YourReserves.js";
import Edit from "./Controllers/EditReserve.js";
import Update from "./Controllers/UpdateReserve.js";
import Delete from "./Controllers/DeleteReserve.js";
import AllReserves from "./Controllers/Reserves.js";
import GetReserve from "./Controllers/GetReserve.js";
import Payment from "./Controllers/RazorpayPayment.js";
import BookingCookie from "./Controllers/BookingCookie.js";
import YourBookings from "./Controllers/YourBooking.js";

const app = express();

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_API_URL,
    credentials: true,
  })
);

app.get("/set-test-cookie", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Not found" });
  }

  const cookies = req.cookies;
  console.log("cookies", cookies);
  res.cookie("testCookie", "testValue", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ message: "Cookie set", cookies });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/ready", (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  const isMongoReady = mongoState === 1;

  if (!isMongoReady) {
    return res.status(503).json({
      status: "not_ready",
      mongoReadyState: mongoState,
    });
  }

  res.status(200).json({
    status: "ready",
    mongoReadyState: mongoState,
  });
});

app.use(RegisterHandler);
app.use(LoginHandler);
app.use(photos);
app.use(AddReserve);
app.use(YourReserves);
app.use(Edit);
app.use(Update);
app.use(Delete);
app.use(AllReserves);
app.use(GetReserve);
app.use(Payment);
app.use(BookingCookie);
app.use(YourBookings);

export default app;
