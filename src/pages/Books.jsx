import { useMemo, useState } from 'react';

// Display the book catalogue and give librarians tools to maintain it.
function Books({ books, setBooks, isLibrarian }) {
  const emptyForm = {
    title: '',
    author: '',
    genre: '',
    isbn: '',
    quantity: '0',
  };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  // Filter the catalogue as the user types in the search field.
  const filteredBooks = useMemo(
    () =>
      books.filter((book) =>
        `${book.title} ${book.author} ${book.genre} ${book.isbn}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [books, search],
  );

  const availableCopies = books.reduce(
    (total, book) => total + Number(book.quantity || 0),
    0,
  );
  const lowStockCount = books.filter((book) => Number(book.quantity) < 2).length;

  function submit(event) {
    event.preventDefault();

    const book = {
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      isbn: form.isbn.trim(),
      quantity: Number(form.quantity),
    };

    if (
      !book.title ||
      !book.author ||
      !book.genre ||
      !book.isbn ||
      !Number.isInteger(book.quantity) ||
      book.quantity < 0
    ) {
      setMessage('Enter valid book information. Quantity must be zero or more.');
      return;
    }

    const duplicateIsbn = books.some(
      (savedBook) => savedBook.isbn === book.isbn && savedBook.isbn !== editing,
    );

    if (duplicateIsbn) {
      setMessage('That ISBN is already registered.');
      return;
    }

    setBooks((currentBooks) =>
      editing
        ? currentBooks.map((savedBook) =>
            savedBook.isbn === editing ? book : savedBook,
          )
        : [...currentBooks, book],
    );

    setForm(emptyForm);
    setEditing(null);
    setMessage(editing ? 'Book updated successfully.' : 'Book added successfully.');
  }

  function editBook(book) {
    setForm({ ...book, quantity: String(book.quantity) });
    setEditing(book.isbn);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function removeBook(book) {
    if (window.confirm(`Delete "${book.title}" from the catalogue?`)) {
      setBooks((currentBooks) =>
        currentBooks.filter((savedBook) => savedBook.isbn !== book.isbn),
      );
    }
  }

  function openTransaction(isbn) {
    window.location.href = `/transactions?isbn=${encodeURIComponent(isbn)}`;
  }

  return (
    <main>
      <h1>Book Management</h1>
      <div className="book-container">
        <div className="books-top-section">
          {isLibrarian && (
            <section className="book-form-section">
              <h2>{editing ? 'Update Book' : 'Add Book'}</h2>
              {message && <p className="form-message">{message}</p>}

              <form onSubmit={submit}>
                <label htmlFor="book-title">Title</label>
                <input
                  id="book-title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Enter book title"
                  required
                />

                <label htmlFor="book-author">Author</label>
                <input
                  id="book-author"
                  value={form.author}
                  onChange={(event) => setForm({ ...form, author: event.target.value })}
                  placeholder="Enter book author"
                  required
                />

                <label htmlFor="book-genre">Genre</label>
                <input
                  id="book-genre"
                  value={form.genre}
                  onChange={(event) => setForm({ ...form, genre: event.target.value })}
                  placeholder="Enter book genre"
                  required
                />

                <label htmlFor="book-isbn">ISBN</label>
                <input
                  id="book-isbn"
                  value={form.isbn}
                  onChange={(event) => setForm({ ...form, isbn: event.target.value })}
                  placeholder="Enter ISBN"
                  required
                />

                <label htmlFor="book-quantity">Initial Quantity</label>
                <input
                  id="book-quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                  required
                />

                <button type="submit">{editing ? 'Save Changes' : 'Add Book'}</button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyForm);
                      setEditing(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </section>
          )}

          <section className="book-overview">
            {/* Use a simpler heading instead of the previous technical label. */}
            <h2>{isLibrarian ? 'Books Summary' : 'My Library'}</h2>
            <div className="book-stat">
              <span className="stat-icon">📚</span>
              <div>
                <p>{isLibrarian ? 'Total Books' : 'Books Available'}</p>
                <strong>{books.length}</strong>
              </div>
            </div>
            <div className="book-stat">
              <span className="stat-icon">📖</span>
              <div><p>Available Copies</p><strong>{availableCopies}</strong></div>
            </div>
            {isLibrarian ? (
              <div className="book-stat">
                <span className="stat-icon">⚠️</span>
                <div><p>Low Stock</p><strong>{lowStockCount}</strong></div>
              </div>
            ) : (
              <div className="book-stat">
                <span className="stat-icon">🕒</span>
                <div><p>My Transactions</p><strong>Use the Transactions page</strong></div>
              </div>
            )}
          </section>
        </div>

        <section className="book-list-section">
          <div className="book-list-header">
            <h2>Book Catalogue</h2>
            <div className="book-search">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, author, genre or ISBN"
                aria-label="Search books"
              />
            </div>
          </div>

          <div id="books-container">
            {filteredBooks.length === 0 ? (
              <p>No books match your search.</p>
            ) : (
              filteredBooks.map((book) => (
                <article className="book-item" key={book.isbn}>
                  <div>
                    <h3>{book.title}</h3>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p>
                      <strong>Available copies:</strong>{' '}
                      <span className={Number(book.quantity) < 2 ? 'low-stock' : ''}>
                        {book.quantity}
                      </span>
                    </p>
                  </div>
                  <div className="book-item-actions">
                    {isLibrarian && (
                      <>
                        <button type="button" onClick={() => editBook(book)}>Edit</button>
                        <button type="button" onClick={() => removeBook(book)}>Delete</button>
                      </>
                    )}
                    <button type="button" onClick={() => openTransaction(book.isbn)}>
                      Borrow / Stock
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Books;
