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

// Add starter books and the two demo accounts without deleting existing user data.
export function seedData() {
  if (!localStorage.getItem('books')) {
    saveData('books', [
      {
        title: 'Things Fall Apart',
        author: 'Chinua Achebe',
        genre: 'Fiction',
        isbn: '9780385474542',
        quantity: 4,
      },
      {
        title: 'The River Between',
        author: 'Ngũgĩ wa Thiong’o',
        genre: 'Classic',
        isbn: '9780435905484',
        quantity: 1,
      },
      {
        title: 'Born a Crime',
        author: 'Trevor Noah',
        genre: 'Memoir',
        isbn: '9780399588198',
        quantity: 3,
      },
    ]);
  }

  const savedUsers = readData('users', []);
  const demoAccounts = [
    {
      name: 'Demo Librarian',
      membershipId: 'LIB001',
      role: 'Librarian',
      password: '',
    },
    {
      name: 'Demo Member',
      membershipId: 'MEM001',
      role: 'Member',
      password: '',
    },
  ];

  // Refresh the demo credentials but preserve any other registered users.
  const usersWithDemoAccounts = [...savedUsers];
  demoAccounts.forEach((demoAccount) => {
    const existingIndex = usersWithDemoAccounts.findIndex(
      (user) => String(user.membershipId ?? '').toLowerCase() === demoAccount.membershipId.toLowerCase(),
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
