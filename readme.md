# Natours Application

Built using modern technologies: Node.js, Express, MongoDB and Mongoose with Jonas

Add some my own functionality like

1. Signup Page:
   Instead of just mentioning a "signup page," let's clarify the endpoint and parameters:

Endpoint: /api/signup
Method: POST
Request Payload:
username
password
email
photo (user's profile photo)
Response: Inform success or failure with appropriate status codes.

2. Create Review on Booked Tour:
   Make sure to include the booked tour ID in the request, assuming you have a booking ID associated with tours.

Endpoint: /api/reviews
Method: POST
Request Payload:
userId (from the logged-in user)
bookedTourId (ID of the booked tour)
rating
comment
Response: Inform success or failure with appropriate status codes.

3. Get All Reviews for the Logged-in User:
   Make sure the user is authenticated before providing reviews.

Endpoint: /api/reviews
Method: GET
Request Headers: Include user authentication token.
Response: An array of reviews for the logged-in user.

4. Get All Booked Tours for Billing:
   Assuming the user has booked tours, return a summary of each booked tour.

Endpoint: /api/booked-tours
Method: GET
Request Headers: Include user authentication token.
Response: An array of booked tours with tour name and price.

//In future, adding Admin's features and api also
