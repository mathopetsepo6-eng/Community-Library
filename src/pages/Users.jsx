import { useState } from 'react';
import { saveData } from '../storage.js';

// Let librarians add, search, update, and remove library user accounts.
function Users({ users, setUsers, currentUser }) {
  const emptyForm = { name: '', membershipId: '', role: 'Member' };
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  function submit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const membershipId = form.membershipId.trim();
    const role = form.role;

    if (!name || !membershipId || !role) {
      setMessage('Please fill in all required user fields.');
      return;
    }


    const duplicateId = users.some(
      (savedUser) =>
        savedUser.membershipId.toLowerCase() === membershipId.toLowerCase() &&
        savedUser.membershipId !== editing,
    );

    if (duplicateId) {
      setMessage('That Membership ID is already in use.');
      return;
    }

    // Keep account details simple: users sign in with their membership ID only.
    const updatedUsers = editing
      ? users.map((savedUser) => {
          if (savedUser.membershipId !== editing) {
            return savedUser;
          }

          return {
            ...savedUser,
            name,
            membershipId,
            role,
          };
        })
      : [...users, { name, membershipId, role }];

    saveData('users', updatedUsers);
    setUsers(updatedUsers);

    // Keep the current session's visible account details in sync after an edit.
    if (currentUser && currentUser.membershipId === editing) {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ name, membershipId, role }),
      );
    }

    setForm(emptyForm);
    setEditing(null);
    setMessage(editing ? 'User updated successfully.' : 'User added successfully.');
  }

  function editUser(savedUser) {
    setEditing(savedUser.membershipId);
    setForm({
      name: savedUser.name,
      membershipId: savedUser.membershipId,
      role: savedUser.role,
    });
    setMessage('Update the account details below. Users sign in with their Membership ID.');
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setMessage('');
  }

  function removeUser(savedUser) {
    if (savedUser.membershipId === currentUser?.membershipId) {
      setMessage('You cannot delete the account currently signed in.');
      return;
    }

    if (window.confirm(`Delete ${savedUser.name}?`)) {
      const updatedUsers = users.filter(
        (userToKeep) => userToKeep.membershipId !== savedUser.membershipId,
      );
      setUsers(updatedUsers);
      saveData('users', updatedUsers);
    }
  }

  const visibleUsers = users.filter((savedUser) =>
    `${savedUser.name} ${savedUser.membershipId} ${savedUser.role}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main>
      <h1>User Management</h1>
      <div className="user-management">
        <section className="user-form-section">
          <h2>{editing ? 'Update User' : 'Add New User'}</h2>
          {message && <p className="form-message">{message}</p>}

          <form onSubmit={submit}>
            <label htmlFor="user-name">Name</label>
            <input
              id="user-name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Enter user name"
              required
            />

            <label htmlFor="user-membership-id">Membership ID</label>
            <input
              id="user-membership-id"
              value={form.membershipId}
              onChange={(event) =>
                setForm({ ...form, membershipId: event.target.value })
              }
              placeholder="Enter Membership ID"
              required
            />

            <label htmlFor="user-role">Role</label>
            <select
              id="user-role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              required
            >
              <option value="Librarian">Librarian</option>
              <option value="Member">Member</option>
            </select>

            <button type="submit">{editing ? 'Save Changes' : 'Add User'}</button>
            {editing && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="user-list-section">
          <h2>Registered Users</h2>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users"
            aria-label="Search users"
          />

          {visibleUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            visibleUsers.map((savedUser) => (
              <article className="user-item" key={savedUser.membershipId}>
                <div>
                  <h3>{savedUser.name}</h3>
                  <p><strong>Membership ID:</strong> {savedUser.membershipId}</p>
                  <p><strong>Role:</strong> {savedUser.role}</p>
                </div>
                <div>
                  <button type="button" onClick={() => editUser(savedUser)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => removeUser(savedUser)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

export default Users;
