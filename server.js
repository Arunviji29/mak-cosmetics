const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_SlI1qCPtzNiIzm",
  key_secret: "tnmXuXmrUFvE20KE9iwnEtxT"
});

// CREATE ORDER
app.post("/create-order", async (req, res) => {
  const order = await razorpay.orders.create({
    amount: req.body.amount,
    currency: "INR"
  });
  res.json(order);
});

// VERIFY PAYMENT
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", "YOUR_SECRET")
    .update(body)
    .digest("hex");

  if (expected === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.json({ status: "failed" });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));