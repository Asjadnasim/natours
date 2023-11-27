/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { signUp, login, logOut } from './login';
import { updateSettings } from './updateSetting';
import { bookTour } from './stripe';
import { createReviewForTour } from './review';

// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUserData = document.querySelector('.form-user-data');
const updateUserPassword = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');
const signUpForm = document.querySelector('.form--signup');
const createReviewForm = document.querySelector('.form--createReview');
const createReviewButton = document.querySelector('.create--review');
const sectionCreateReview = document.querySelector('.section-createReviews');
const submitButtonOnCreateReview = document.querySelector('.review-save');

// DELEGATIONS

if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logOut);

if (updateUserData)
  updateUserData.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
if (signUpForm)
  signUpForm.addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData();
    document.querySelector('.btn-create').textContent = 'Creating...';
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('password', document.getElementById('password').value);
    form.append(
      'passwordConfirm',
      document.getElementById('passwordConfirm').value
    );
    form.append('photo', document.getElementById('photo').files[0]);

    await signUp(form, 'data');
  });

if (updateUserPassword)
  updateUserPassword.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

createReviewButton.addEventListener('click', () => {
  sectionCreateReview.style.display = 'block';
  submitButtonOnCreateReview.style.display = 'block';
});

if (createReviewForm)
  createReviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const submitButton = e.submitter;

    const { tourId, userId } = submitButton.dataset;
    // console.log('Hey I am e.target:', e.target);
    // console.log('Hey i am tour Id:', tourId);
    // console.log('Hey i am user Id:', userId);
    createReviewForTour(review, rating, tourId, userId);
  });
