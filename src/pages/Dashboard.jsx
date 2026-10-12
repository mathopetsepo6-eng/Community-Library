// Show a quick summary of books, stock levels, and library information.
function Dashboard({ books, transactions, user }) {
  const isLibrarian = user?.role === 'Librarian';
  const totalCopies = books.reduce((sum, book) => sum + Number(book.quantity || 0), 0);
  const lowStock = books.filter((book) => Number(book.quantity) < 2).length;

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <h1>Library Dashboard</h1>
          <p>
            Welcome to Community library Library. Browse books, check library information, and view
            transactions from one place.
          </p>
        </div>
      </section>

      <section className="dashboard">
        <div className="dashboard-card">
          <div className="card-icon">📚</div>
          <div><h3>Total Books</h3><p>{books.length}</p></div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon">📖</div>
          <div><h3>Available Copies</h3><p>{totalCopies}</p></div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon">⚠️</div>
          <div><h3>Low Stock Books</h3><p>{lowStock}</p></div>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Quick Actions</h2>
            <p>Frequently used library functions</p>
          </div>
          <div className="quick-actions">
            <a href="/books" className="action-card">
              <span className="action-icon">📚</span>
              <div><h3>{isLibrarian ? 'Manage Books' : 'Browse Books'}</h3><p>{isLibrarian ? 'Add, update, or remove books' : 'View the available book collection'}</p></div>
            </a>
            <a href="/transactions" className="action-card">
              <span className="action-icon">🔄</span>
              <div><h3>Transactions</h3><p>{isLibrarian ? 'Borrow books or add stock' : 'Borrow books and view transaction history'}</p></div>
            </a>
            {isLibrarian && (
              <a href="/users" className="action-card">
                <span className="action-icon">👥</span>
                <div><h3>Manage Users</h3><p>Manage library members</p></div>
              </a>
            )}
          </div>
        </div>

        {/* Keep practical location and opening details visible on the dashboard. */}
        <div className="dashboard-panel library-info">
          <div className="panel-header">
            <h2>Library Information</h2>
            <p>Community library Library</p>
          </div>
          <div className="info-item">
            <span>Location</span>
            <strong>Lesotho</strong>
          </div>
          <div className="info-item">
            <span>Opening Hours</span>
            <strong>08:00–17:00</strong>
          </div>
          <div className="info-item">
            <span>Operating Days</span>
            <strong>Monday–Friday</strong>
          </div>
          <div className="info-item">
            <span>Transactions</span>
            <strong>{transactions.length} recorded</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-notice">
        <div>
          <h2>{isLibrarian ? 'Library Management' : 'Your Library'}</h2>
          <p>{isLibrarian ? 'Keep track of books, monitor stock levels, and manage library members.' : 'Browse the book collection and check which copies are available.'}</p>
        </div>
        <a href="/books">View Books</a>
      </section>
    </main>
  );
}

export default Dashboard;
