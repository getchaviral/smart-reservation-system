import "dotenv/config";
import mongoose from "mongoose";
import { Reserve } from "../Modals/Reserve.js";
import prodReserves from "../data/prodReserves.js";

const connectionString = process.env.Mongo_ConnectionString;

if (!connectionString) {
  console.error("Missing Mongo_ConnectionString in environment.");
  process.exit(1);
}

if (!Array.isArray(prodReserves) || prodReserves.length === 0) {
  console.error(
    "No production seed data found. Add records to Server/data/prodReserves.js before running seed:prod."
  );
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

  for (const reserve of prodReserves) {
    await upsertReserve(reserve);
  }

  console.log(`Seeded/updated ${prodReserves.length} production reserves.`);
  await mongoose.disconnect();
} catch (error) {
  console.error("Production seed failed:", error.message);
  process.exit(1);
}
