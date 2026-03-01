import mongoose from "mongoose";

const PaymentTransactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    paymentId: {
      type: String,
      index: true,
      sparse: true,
    },
    razorpaySignature: String,
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },
    itemName: String,
    itemSchedule: String,
    bookingSnapshot: {
      type: Object,
      default: {},
    },
    verifiedAt: Date,
    failureReason: String,
  },
  { timestamps: true }
);

const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  PaymentTransactionSchema
);

export default PaymentTransaction;
