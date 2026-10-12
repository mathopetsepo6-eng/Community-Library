# Mofolo 2 Library Management System

A React-based library management application. It uses React components and hooks, React Router, controlled forms, and browser `localStorage` to keep book, user, and transaction data between refreshes.

## Run the project

1. Install Node.js.
2. Open this project folder in VS Code.
3. Open a terminal in this folder (the same folder that contains `package.json`).
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local address printed in the terminal.

## Demo login accounts

Enter only the Membership ID on the login page. No password is required.

| Role | Membership ID |
|---|---|
| Librarian | `LIB001` |
| Member | `MEM001` |

## Main features

- ID-only login for Librarian and Member roles.
- Dashboard and library information are visible to members and librarians.
- Members can browse books and borrow available copies.
- Librarians can add, edit, search, and delete books.
- Librarians can add stock and manage user accounts.
- Transaction history records borrowing and stock changes.
- Application data is saved in browser `localStorage`.
- Responsive layout with a brown, white, and teal colour theme.

## Source code layout

- `src/App.jsx`: application state, routing, login/logout, and stock updates.
- `src/components/Shell.jsx`: shared navigation layout.
- `src/pages/Login.jsx`: ID-only login form and demo account IDs.
- `src/pages/Dashboard.jsx`: dashboard, book summary, and library information.
- `src/pages/Books.jsx`: book catalogue and book forms.
- `src/pages/Transactions.jsx`: borrowing, stock, and transaction history.
- `src/pages/Users.jsx`: user account management.
- `src/storage.js`: localStorage helpers and demo data.
- `src/styles.css`: layout, responsive styling, and colour theme.

## Important note

This project is a coursework demonstration. Login is based on membership ID only and is not suitable for production security. Data is saved separately in each browser, so clearing browser storage removes the locally saved records.
