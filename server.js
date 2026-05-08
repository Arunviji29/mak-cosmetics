const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_SlI1qCPtzNiIzm",
  key_secret: "tnmXuXmrUFvE20KE9iwnEtxT",
});

// CREATE ORDER
app.post("/create-order", async (req, res) => {

  try {

    const options = {
      amount: req.body.amount,
      currency: "INR",
      receipt: "receipt_order"
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {

    console.log(err);
    res.status(400).send(err);

  }

});

// VERIFY PAYMENT
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "tnmXuXmrUFvE20KE9iwnEtxT")
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.json({ status: "failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
