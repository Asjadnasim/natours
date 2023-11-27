/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

exports.createReviewForTour = async (review, rating, tourId, userId) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/reviews',
			data: {
				review,
				rating,
				tour: tourId,
				user: userId,
			},
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Successfully created your review!');
			window.setTimeout(() => {
				location.reload();
			}, 1000);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
