import React, { useState } from 'react';

const workers = ['Tirupamma', 'Kavitha', 'Nagamani', 'Triveni', 'Rajesh', 'Pichaya', 'NagaRaju'];

const starStyle = {
  cursor: 'pointer',
  color: '#FFD700',
  fontSize: '24px',
  marginRight: '5px'
};

const Ratings = () => {
  const [ratings, setRatings] = useState({
    quality: 0,
    quantity: 0,
    waitingTime: 0,
    receivingTime: 0,
  });
  const [feedback, setFeedback] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState([]);

  const handleStarClick = (aspect, value) => {
    setRatings({ ...ratings, [aspect]: value });
  };

  const handleSubmit = () => {
    if (Object.values(ratings).some(v => v === 0)) {
      alert('Please rate all aspects');
      return;
    }
    const review = { ...ratings, feedback, date: new Date().toLocaleString() };
    setSubmittedReviews([review, ...submittedReviews]);
    setRatings({ quality: 0, quantity: 0, waitingTime: 0, receivingTime: 0 });
    setFeedback('');
  };

  const renderStars = (aspect, editable = true) => {
    const stars = [];
    const value = ratings[aspect];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={starStyle}
          onClick={editable ? () => handleStarClick(aspect, i) : undefined}
        >
          {i <= value ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  // Calculate average rating for each aspect
  const getAverage = (aspect) => {
    if (submittedReviews.length === 0) return 0;
    const sum = submittedReviews.reduce((acc, r) => acc + r[aspect], 0);
    return (sum / submittedReviews.length).toFixed(1);
  };

  const renderStarsReadOnly = (num) => {
    const fullStars = '★'.repeat(Math.round(num));
    const emptyStars = '☆'.repeat(5 - Math.round(num));
    return fullStars + emptyStars;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Rate Our Nursery</h1>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>Give Your Rating</h2>

        <div style={{ marginBottom: '15px' }}>
          <label>Quality of Plants: </label>
          {renderStars('quality')}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Quantity of Crop: </label>
          {renderStars('quantity')}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Waiting Time: </label>
          {renderStars('waitingTime')}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Receiving Time: </label>
          {renderStars('receivingTime')}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Feedback (optional): </label><br />
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows="3"
            cols="50"
            placeholder="Share your experience..."
          />
        </div>

        <button onClick={handleSubmit} style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Submit Review
        </button>
      </div>

      {/* Average Ratings */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Average Ratings</h2>
        <p>Quality: {renderStarsReadOnly(getAverage('quality'))} ({getAverage('quality')}/5)</p>
        <p>Quantity: {renderStarsReadOnly(getAverage('quantity'))} ({getAverage('quantity')}/5)</p>
        <p>Waiting Time: {renderStarsReadOnly(getAverage('waitingTime'))} ({getAverage('waitingTime')}/5)</p>
        <p>Receiving Time: {renderStarsReadOnly(getAverage('receivingTime'))} ({getAverage('receivingTime')}/5)</p>
      </div>

      {/* Recent Reviews */}
      <h2>Recent Reviews</h2>
      {submittedReviews.length === 0 && <p>No reviews yet.</p>}
      {submittedReviews.map((review, index) => (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <p><strong>Date:</strong> {review.date}</p>
          <p>Quality: {'★'.repeat(review.quality)}{'☆'.repeat(5 - review.quality)}</p>
          <p>Quantity: {'★'.repeat(review.quantity)}{'☆'.repeat(5 - review.quantity)}</p>
          <p>Waiting: {'★'.repeat(review.waitingTime)}{'☆'.repeat(5 - review.waitingTime)}</p>
          <p>Receiving: {'★'.repeat(review.receivingTime)}{'☆'.repeat(5 - review.receivingTime)}</p>
          {review.feedback && <p>Feedback: {review.feedback}</p>}
        </div>
      ))}

      {/* Workers */}
      <h2>Our Workers</h2>
      <ul>
        {workers.map((worker, idx) => (
          <li key={idx}>{worker}</li>
        ))}
      </ul>
    </div>
  );
};

export default Ratings;
