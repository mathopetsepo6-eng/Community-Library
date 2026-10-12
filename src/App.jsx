import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { readData, saveData, seedData } from './storage.js';
import Shell from './components/Shell.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Books from './pages/Books.jsx';
import Transactions from './pages/Transactions.jsx';
import Users from './pages/Users.jsx';

// Make sure the initial books and demo accounts exist before reading saved data.
seedData();

export default function App() {
  const [books, setBooks] = useState(() => readData('books', []));
  const [users, setUsers] = useState(() => readData('users', []));
  const [transactions, setTransactions] = useState(() => readData('transactions', []));
  const [user, setUser] = useState(() => readData('currentUser', null));
  const navigate = useNavigate();
  const location = useLocation();

  // Keep application data in localStorage whenever it changes.
  useEffect(() => saveData('books', books), [books]);
  useEffect(() => saveData('users', users), [users]);
  useEffect(() => saveData('transactions', transactions), [transactions]);

  useEffect(() => {
    if (user) {
      saveData('currentUser', user);
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  // Sign in using the membership ID only. The ID determines the user's role.
  function login(membershipId) {
    const foundUser = users.find(
      (savedUser) =>
        String(savedUser.membershipId ?? '').trim().toLowerCase() ===
        membershipId.trim().toLowerCase(),
    );

    if (!foundUser) {
      return false;
    }

    const sessionUser = {
      name: foundUser.name,
      membershipId: foundUser.membershipId,
      role: foundUser.role,
    };

    setUser(sessionUser);
    navigate('/dashboard');
    return true;
  }

  // Clear the current session and return to the login screen.
  function logout() {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  }

  // Add or deduct copies and record each successful stock transaction.
  function changeStock(isbn, type, quantity) {
    const book = books.find((savedBook) => savedBook.isbn === isbn);

    if (!book) {
      return 'Book not found. Check the ISBN.';
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return 'Quantity must be a whole number greater than zero.';
    }

    if (type === 'Borrowed' && Number(book.quantity) < quantity) {
      return 'There are not enough copies available.';
    }

    setBooks((currentBooks) =>
      currentBooks.map((savedBook) =>
        savedBook.isbn === isbn
          ? {
              ...savedBook,
              quantity:
                Number(savedBook.quantity) +
                (type === 'Stock Added' ? quantity : -quantity),
            }
          : savedBook,
      ),
    );

    setTransactions((currentTransactions) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        bookTitle: book.title,
        isbn: book.isbn,
        type,
        quantity,
        date: new Date().toLocaleString(),
        by: user?.name || 'Unknown user',
      },
      ...currentTransactions,
    ]);

    return type === 'Stock Added'
      ? 'Stock added successfully.'
      : 'Book borrowing recorded successfully.';
  }

  const isLibrarian = user?.role === 'Librarian';
  const needsLogin = (element) =>
    user ? element : <Navigate to="/login" replace state={{ from: location.pathname }} />;
  const librarianOnly = (element) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return isLibrarian ? element : <Navigate to="/books" replace />;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={login} />
          )
        }
      />
      <Route
        path="/users"
        element={librarianOnly(
          <Shell user={user} onLogout={logout}>
            <Users users={users} setUsers={setUsers} currentUser={user} />
          </Shell>,
        )}
      />
      <Route
        path="/"
        element={
          <Navigate
            to={user ? '/dashboard' : '/login'}
            replace
          />
        }
      />
      <Route
        path="/dashboard"
        element={needsLogin(
          <Shell user={user} onLogout={logout}>
            <Dashboard books={books} transactions={transactions} user={user} />
          </Shell>,
        )}
      />
      <Route
        path="/books"
        element={needsLogin(
          <Shell user={user} onLogout={logout}>
            <Books books={books} setBooks={setBooks} isLibrarian={isLibrarian} />
          </Shell>,
        )}
      />
      <Route
        path="/transactions"
        element={needsLogin(
          <Shell user={user} onLogout={logout}>
            <Transactions
              books={books}
              transactions={transactions}
              onChangeStock={changeStock}
              isLibrarian={isLibrarian}
              user={user}
            />
          </Shell>,
        )}
      />
      <Route
        path="*"
        element={
          <Navigate
            to={user ? '/dashboard' : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}
