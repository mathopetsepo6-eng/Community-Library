```javascript
// Read saved data from the browser. Return the fallback if no valid data exists.
export function readData(key, fallback) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue === null ? fallback : JSON.parse(savedValue);
  } catch {
    return fallback;
  }
}

// Save JavaScript data as JSON so it can be loaded after a page refresh.
export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initialize demo accounts and transactions.
export function initializeStorage() {
  const savedUsers = readData('users', []);

  const demoAccounts = [
    {
      name: 'Demo Librarian',
      membershipId: 'ADMIN1',
      role: 'Librarian',
      password: '',
    },
    {
      name: 'Demo Member',
      membershipId: 'USER1',
      role: 'Member',
      password: '',
    },
  ];

  // Refresh demo credentials while preserving other registered users.
  const usersWithDemoAccounts = [...savedUsers];

  demoAccounts.forEach((demoAccount) => {
    const existingIndex = usersWithDemoAccounts.findIndex(
      (user) =>
        String(user.membershipId ?? '').toLowerCase() ===
        demoAccount.membershipId.toLowerCase(),
    );

    if (existingIndex === -1) {
      usersWithDemoAccounts.push(demoAccount);
    } else {
      usersWithDemoAccounts[existingIndex] = {
        ...usersWithDemoAccounts[existingIndex],
        ...demoAccount,
      };
    }
  });

  saveData('users', usersWithDemoAccounts);

  if (!localStorage.getItem('transactions')) {
    saveData('transactions', []);
  }
}
```
