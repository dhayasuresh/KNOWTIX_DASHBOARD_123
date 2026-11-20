// utils/fakeAuth.js
let fakeUserDB = [
  { id: 1, username: "admin", password: "admin123" },
];

export const login = ({ username, password }) => {
  const user = fakeUserDB.find(
    (u) => u.username === username && u.password === password
  );
  if (user) return { success: true, user };
  return { success: false, message: "Invalid credentials" };
};

export const signup = ({ username, password }) => {
  const exists = fakeUserDB.some((u) => u.username === username);
  if (exists) return { success: false, message: "User already exists" };
  const newUser = { id: fakeUserDB.length + 1, username, password };
  fakeUserDB.push(newUser);
  return { success: true, user: newUser };
};
