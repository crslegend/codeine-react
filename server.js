const express = require("express");
const bodyParser = require("body-parser");
// const axios = require("axios");
const cors = require("cors");

require("dotenv").config(); // this line must exist before calling process.env.*

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options("*", cors());

// stripe checkout for contribution
app.post("/create-checkout-session", async (req, res) => {
  const transaction = req.body;
  console.log(transaction);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: transaction.email,
      line_items: [
        {
          description: transaction.description,
          price_data: {
            currency: "sgd",
            product_data: {
              name: transaction.description,
            },
            unit_amount: parseFloat(transaction.total_price) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/payment/success?sessionid={CHECKOUT_SESSION_ID}&pId=${transaction.pId}&contribution=${transaction.contribution}`,
      cancel_url: `http://localhost:3000/partner/home/contributions`,
    });
    res.json({ id: session.id });
  } catch (err) {
    // console.log(err);
    res.json(err);
  }
});

// stripe checkout for consultation
app.post("/create-consultation-checkout-session", async (req, res) => {
  const transaction = req.body;
  console.log(transaction);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: transaction.email,
      line_items: [
        {
          description: transaction.description,
          price_data: {
            currency: "sgd",
            product_data: {
              name: transaction.description,
            },
            unit_amount: parseFloat(transaction.total_price) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/payment/success?sessionid={CHECKOUT_SESSION_ID}&mId=${transaction.mId}&consultation=${transaction.consultation}`,
      cancel_url: `http://localhost:3000/courses/enroll/consultation/${transaction.pId}`,
    });
    res.json({ id: session.id });
  } catch (err) {
    // console.log(err);
    res.json(err);
  }
});

// stripe checkout for upgrading to pro-tier members
app.post("/create-checkout-session-upgrade-pro", async (req, res) => {
  const transaction = req.body;
  console.log(transaction);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: transaction.email,
      line_items: [
        {
          description: transaction.description,
          price_data: {
            currency: "sgd",
            product_data: {
              name: transaction.description,
            },
            unit_amount: parseFloat(transaction.total_price) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/payment/success?sessionid={CHECKOUT_SESSION_ID}&mId=${transaction.mId}&upgradeTransaction=${transaction.transaction}`,
      cancel_url: `http://localhost:3000/member/payment`,
    });
    res.json({ id: session.id });
  } catch (err) {
    // console.log(err);
    res.json(err);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
