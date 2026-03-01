const requiredEnvByMode = {
  base: [
    "Mongo_ConnectionString",
    "ACCESS",
    "REFRESH",
    "Cloudinary_Name",
    "Cloudinary_APIKEY",
    "Cloudinary_SECRET",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "FRONTEND_API_URL",
  ],
  production: ["NODE_ENV"],
};

export const validateEnv = () => {
  const mode = process.env.NODE_ENV || "development";
  const required = [...requiredEnvByMode.base];

  if (mode === "production") {
    required.push(...requiredEnvByMode.production);
  }

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
};
