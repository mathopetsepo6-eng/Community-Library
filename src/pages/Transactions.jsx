import { useState } from 'react';

// Allow users to borrow books and librarians to add new stock.
function Transactions({ books, transactions, onChangeStock, isLibrarian, user }) {
  const queryParams = new URLSearchParams(window.location.search);
  const [isbn, setIsbn] = useState(queryParams.get('isbn') || '');
  const [quantity, setQuantity] = useState('1');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  function runTransaction(type) {
    const result = onChangeStock(isbn.trim(), type, Number(quantity));
    const succeeded = result.includes('successfully');

    setMessage(result);
    setMessageType(succeeded ? 'success' : 'error');

    if (succeeded) {
      setQuantity('1');
    }
  }

  function submitStock(event) {
    event.preventDefault();
    if (isLibrarian) {
      runTransaction('Stock Added');
    }
  }

  return (
    <main>
      <h1>Transactions</h1>
      <div className="transaction-container">
        <section className="transaction-form-section">
          <h2>Book Transaction</h2>
          {message && <p className={`form-message ${messageType}`}>{message}</p>}

          <form onSubmit={submitStock}>
            <label htmlFor="transaction-isbn">Book ISBN</label>
            <select
              id="transaction-isbn"
              value={isbn}
              onChange={(event) => setIsbn(event.target.value)}
              required
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.isbn} value={book.isbn}>
                  {book.isbn} — {book.title} ({book.quantity} available)
                </option>
              ))}
            </select>

            <label htmlFor="transaction-quantity">Quantity</label>
            <input
              id="transaction-quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />

            {isLibrarian && <button type="submit">Add Stock</button>}
            <button type="button" onClick={() => runTransaction('Borrowed')}>
              Borrow Book
            </button>
          </form>
        </section>

        <section className="transaction-history">
          <h2>Transaction History</h2>
          {transactions.length === 0 ? (
            <p>No transactions have been recorded yet.</p>
          ) : (
            transactions.map((transaction) => (
              <article className="transaction-item" key={transaction.id}>
                <h3>{transaction.bookTitle}</h3>
                <p><strong>Type:</strong> {transaction.type}</p>
                <p><strong>Quantity:</strong> {transaction.quantity}</p>
                <p><strong>ISBN:</strong> {transaction.isbn}</p>
                <p><strong>Date:</strong> {transaction.date}</p>
                <p><strong>By:</strong> {transaction.by || user.name}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

export default Transactions;
