import "dotenv/config";
import mongoose from "mongoose";
import { validateEnv } from "./config/env.js";
import app from "./app.js";

validateEnv();

const PORT = process.env.PORT || 3000;

// Mongoose Connection
mongoose.connect(process.env.Mongo_ConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.log("Error Connecting"));
db.on("open", () => console.log("Successfully Connected to Database"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running well at ${PORT}`);
});
