/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51NsSatSJ2ZvW1d90gbsRgVvm8WWyqKlrxtBQhD5roO4oQ7hkpZGds7JaXutuhjKAxbnkrlDezy1jaKdsyqs11NMR00yvukIKSQ'
);

export const bookTour = async tourId => {
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
    );
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
