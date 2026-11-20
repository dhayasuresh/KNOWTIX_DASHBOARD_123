// src/utils/userUtils.js

// Mock users
const initialMockUsers = [
  { id: 1, username: 'achu123@gmail.com', email: 'achu123@gmail.com', password: '123', name: 'Achu', grade: '6' },
  { id: 2, username: 'achu', email: null, password: '123456', name: null, grade: '11' },
  { id: 3, username: 'anvi', email: 'anvi123@gmail.com', password: '123456', name: 'anvi', grade: '14' },
  { id: 4, username: 'admin', email:'admin123@gmail.com', password: '123456', name: 'avi', grade: '1' },
  { id: 5, username: 'achuzz', email: null, password: '123456', name: null, grade: '5' },
  { id: 6, username: 'achuzzz', email: null, password: '123456', name: null, grade: '0' },
  { id: 7, username: 'admin', email: null, password: '123456', name: null, grade: '1' },
  { id: 8, username: 'manuzzz', email: null, password: '123456', name: null, grade: '0' },
  { id: 9, username: 'achuu', email: null, password: '123456', name: null, grade: '0' },
  { id: 10, username: 'john', email: null, password: '123456', name: null, grade: '0' },
  { id: 11, username: 'akshu', email:'akshu123@gmail.com', password: '123456', name: null, grade: '0' },
  { id: 12, username: 'mamjnj', email: null, password: '123456', name: null, grade: '0' },
  { id: 13, username: 'akshuu', email: null, password: '123456', name: null, grade: '0' },
  { id: 14, username: 'akshhu', email: null, password: '123456', name: null, grade: '0' },
  { id: 15, username: 'ashu', email: null, password: '123456', name: null, grade: '0' },
  { id: 16, username: 'aju', email: 'aju123@gmail.com', password: '123', name: 'Aju', grade: '6-8' },
  { id: 17, username: 'deepu', email: 'deepu@gmail.com', password: '123456', name: null, grade: '11' },
  { id: 18, username: 'Guru', email: 'guru@gmail.com', password: '123456', name: null, grade: '10' },
  { id: 19, username: 'Achuma', email: 'achuma123@gmail.com', password: '123456', name: null, grade: '8' },
  { id: 20, username: 'Ani', email: 'ani12@gmail.com', password: '123456', name: null, grade: '4' },
  { id: 21, username: 'Arya', email: 'ar@gmail.com', password: '123456', name: null, grade: '6' },
  { id: 22, username: 'sreeya', email: 'sree@gmail.com', password: '123456', name: null, grade: '6' }
];

// Get users from localStorage or initialize with mock data
export const getUsers = () => {
  const users = localStorage.getItem('appUsers');
  if (users) return JSON.parse(users);
  localStorage.setItem('appUsers', JSON.stringify(initialMockUsers));
  return initialMockUsers;
};

// Save users to localStorage
export const saveUsers = (users) => {
  localStorage.setItem('appUsers', JSON.stringify(users));
};

// Add a new user
export const addUser = (newUser) => {
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Find user by email or username (case-insensitive)
export const findUser = (login) => {
  const users = getUsers();
  const loginLower = login.trim().toLowerCase();
  return users.find(u => 
    (u.email && u.email.toLowerCase() === loginLower) || 
    (u.username && u.username.toLowerCase() === loginLower)
  );
};

// Check if a user exists (by email or username)
export const userExists = (email, username) => {
  const users = getUsers();
  return users.some(u => 
    (u.email && u.email.toLowerCase() === email.toLowerCase()) || 
    (u.username && u.username.toLowerCase() === username.toLowerCase())
  );
};

// Validate login credentials
export const validateLogin = (loginInput, passwordInput) => {
  const user = findUser(loginInput);
  if (!user) return { error: "Invalid email or username" };
  if (user.password !== passwordInput) return { error: "Invalid password" };
  return { message: "Login successful", user };
};
