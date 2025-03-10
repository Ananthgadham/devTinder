const validator = require('validator');

const validateSignUpData = (data) => {
    const { firstName, lastName, email, password } = data; // ✅ Fix: Use `data`, not `data.body`

    if (!firstName || !lastName || !email || !password) {
        throw new Error("First name, last name, email, and password are required.");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format.");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong. It must contain uppercase, lowercase, numbers, and symbols.");
    }

    return true; // ✅ Return `true` if validation passes
};


const validateProfileUpdate = (req) => {
    const { firstName,lastName, phone, gender } = req.body; // ✅ Correct way to extract data
    const allowedUpdates = ["firstName","lastName", "phone", "gender"]; // ✅ Define allowed fields
    const isUpdateAllowed = Object.keys(req.body).every((key) => allowedUpdates.includes(key));
    return isUpdateAllowed;
};





module.exports = { validateSignUpData,validateProfileUpdate };
