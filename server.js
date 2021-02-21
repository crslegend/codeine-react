const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

require("dotenv").config(); // this line must exist before calling process.env.*

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// stripe checkout
app.post("/create-checkout-session", async (req, res) => {
  const transaction = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: transaction.customer.customer_email,
      line_items: [
        {
          description: description,
          price_data: {
            currency: "sgd",
            product_data: {
              name: transaction.cart_items[0].product.title,
              images:
                transaction.cart_items[0].product.images.length > 0
                  ? [`${transaction.cart_items[0].product.images[0].image}`]
                  : [],
            },
            unit_amount: parseFloat(transaction.total_price) * 100,
          },
          //   quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/payment/success?sessionid={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/partner/home/content/${transaction}`,
    });
    res.json({ id: session.id });
  } catch (err) {
    // console.log(err);
    res.json(err);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));