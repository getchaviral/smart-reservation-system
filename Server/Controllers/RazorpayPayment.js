import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import PaymentTransaction from "../Modals/PaymentTransaction.js";
import { hasBookingConflict } from "../utils/bookingConflict.js";

const Payment = express();

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

Payment.post("/Payment", async (req, res) => {
  const product = req.body.Pay;
  const Bookingdetails = req.body.Book;

  try {
    const conflictResult = await hasBookingConflict(Bookingdetails || {});
    if (!conflictResult.ok) {
      return res
        .status(conflictResult.status || 400)
        .json({ message: conflictResult.message });
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res
        .status(500)
        .json({ message: "Missing Razorpay server configuration" });
    }

    const baseAmount = Number(product?.amount);
    if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Preserve previous USD->INR conversion behavior used earlier.
    const usdToInrRate = Number(process.env.USD_TO_INR_RATE || 83);
    const amountInPaise = Math.round(baseAmount * usdToInrRate * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        title: product?.name || "",
        schedule: product?.schedule || "",
      },
    });

    const transaction = await PaymentTransaction.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
      itemName: product?.name || "",
      itemSchedule: product?.schedule || "",
      bookingSnapshot: Bookingdetails || {},
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      transactionId: transaction._id,
      Details: Bookingdetails,
    });
  } catch (error) {
    console.error("Razorpay order create error:", error);
    return res.status(500).json({ message: "Payment initialization failed" });
  }
});

Payment.post("/Payment/verify", async (req, res) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res
        .status(500)
        .json({ success: false, message: "Missing Razorpay server configuration" });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transactionId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      if (transactionId) {
        await PaymentTransaction.findByIdAndUpdate(transactionId, {
          status: "failed",
          failureReason: "Invalid signature",
        });
      } else {
        await PaymentTransaction.findOneAndUpdate(
          { orderId: razorpay_order_id },
          {
            status: "failed",
            failureReason: "Invalid signature",
          }
        );
      }
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const filter = transactionId
      ? { _id: transactionId }
      : { orderId: razorpay_order_id };

    const updated = await PaymentTransaction.findOneAndUpdate(
      filter,
      {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Payment transaction not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified",
      transaction: {
        id: updated._id,
        orderId: updated.orderId,
        paymentId: updated.paymentId,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
});

Payment.get("/Payment/status/:id", async (req, res) => {
  try {
    const tx = await PaymentTransaction.findById(req.params.id).lean();
    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      id: tx._id,
      orderId: tx.orderId,
      paymentId: tx.paymentId,
      status: tx.status,
      amount: tx.amount,
      currency: tx.currency,
      verifiedAt: tx.verifiedAt || null,
      createdAt: tx.createdAt,
    });
  } catch (error) {
    console.error("Payment status fetch error:", error);
    return res.status(500).json({ message: "Failed to fetch payment status" });
  }
});

export default Payment;
