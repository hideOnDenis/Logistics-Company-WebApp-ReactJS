// src/services/authService.js
const users = []; // This would be your data.js equivalent

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
    const newUser = { email, password };
    users.push(newUser);
    return newUser;
};
