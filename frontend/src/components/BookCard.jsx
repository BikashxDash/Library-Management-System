// Ye component ek single book ka card dikhata hai
// "book" prop ke through data bahar se aata hai

function BookCard({ book }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>{book.title}</h3>
      <p style={{ margin: '4px 0', color: '#555' }}>by {book.author}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>Category: {book.category}</p>
      <p style={{ margin: '4px 0', fontSize: '14px' }}>
        Available: {book.available_copies} / {book.total_copies}
      </p>
    </div>
  );
}

export default BookCard;