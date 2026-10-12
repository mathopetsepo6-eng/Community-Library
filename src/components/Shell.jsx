import { NavLink } from 'react-router-dom';

// Shared navigation bar used by all pages after login.
function Shell({ user, onLogout, children }) {
  return (
    <>
      <nav className="navbar">
        <div className="logo">Mofolo 2 Library</div>
        <div className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          {user.role === 'Librarian' && <NavLink to="/users">Users</NavLink>}
          <a
            href="/login"
            onClick={(event) => {
              event.preventDefault();
              onLogout();
            }}
          >
            Logout
          </a>
        </div>
      </nav>
      {children}
    </>
  );
}

export default Shell;
