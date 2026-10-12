import { useState } from 'react';

// Sign in with the membership ID only.
function Login({ onLogin }) {
  const [membershipId, setMembershipId] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();

    if (!membershipId.trim()) {
      setError('Enter your Membership ID.');
      return;
    }

    if (!onLogin(membershipId)) {
      setError('That Membership ID was not found. Please try again.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Mofolo 2 Library</h1>
          <p>Library Management System</p>
        </div>

        <div className="login-content">
          <h2>Welcome Back</h2>
          <p className="login-message">Sign in to access your library account.</p>

          {error && <p className="form-message error-message">{error}</p>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="membership-id">Membership ID</label>
              <input
                id="membership-id"
                value={membershipId}
                onChange={(event) => setMembershipId(event.target.value)}
                placeholder="Enter your Membership ID"
                autoComplete="username"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          {/* Display demo IDs so the lecturer can test each role easily. */}
          <div className="demo-accounts">
            <h3>Demo Accounts</h3>
            <p><strong>Librarian ID:</strong> LIB001</p>
            <p><strong>Member ID:</strong> MEM001</p>
            <p>Enter an ID only. No password is required.</p>
          </div>

          <p className="login-footer">Mofolo 2 Library Management System</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
