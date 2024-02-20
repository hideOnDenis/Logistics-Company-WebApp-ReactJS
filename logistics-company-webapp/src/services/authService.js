// src/services/authService.js
const users = [
    {
        id: "1",
        email: "bruh@gmail.com",
        password: "bruh123",
        isAdmin: true,
    },


]; // This would be your data.js equivalent

export const signInService = async ({ email, password }) => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        return user;
    } else {
        throw new Error('User not found');
    }
};

export const signUpService = async ({ email, password }) => {
    // First, check for missing email or password
    if (!email || !password) {
        throw new Error('Missing email or password');
    }

    // Then, check if the user already exists
    const exists = users.some(user => user.email === email);
    if (exists) {
        throw new Error('User already exists');
    }

    // If validation passes and the user does not exist, create a new user
    const newUser = { email, password, isAdmin: false };
    users.push(newUser);
    return newUser;
};

export const getAllUsers = async () => {
    // In a real application, replace this with a fetch request to your backend
    return users; // Return the users array
};

