import "dotenv/config";
import mongoose from "mongoose";
import { Reserve } from "../Modals/Reserve.js";
import demoReserves from "../data/demoReserves.js";

const connectionString = process.env.Mongo_ConnectionString;

if (!connectionString) {
  console.error("Missing Mongo_ConnectionString in environment.");
  process.exit(1);
}

const upsertReserve = async (item) => {
  const filter = {
    MainTitle: item.MainTitle,
    location: item.location,
    category: item.category,
  };

  await Reserve.updateOne(filter, { $set: item }, { upsert: true });
};

try {
  await mongoose.connect(connectionString);

  for (const reserve of demoReserves) {
    await upsertReserve(reserve);
  }

  console.log(`Seeded/updated ${demoReserves.length} dev reserves.`);
  await mongoose.disconnect();
} catch (error) {
  console.error("Dev seed failed:", error.message);
  process.exit(1);
}
