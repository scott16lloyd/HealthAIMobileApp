const functions = require('firebase-functions');
const stripe = require('stripe')(
  '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'
);

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1OHQzoJlRiN1rf0yqV6WJnjo',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'your-success-url',
      cancel_url: 'your-cancel-url',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
