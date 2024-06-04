const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const userSignUp = async (parent, args) => {
    const { firstName, lastName, userName, phone, email, password, profilePic } = args;

    if (!firstName) {
        throw new Error("Please provide first name.");
    }

    if (!lastName) {
        throw new Error("Please provide last name.");
    }

    if (!userName) {
        throw new Error("Please provide user name.");
    }

    if (!phone) {
        throw new Error("Please provide phone.");
    }

    if (!email) {
        throw new Error("Please provide email.");
    }

    if (!password) {
        throw new Error("Please provide password.");
    }

    const duplicateUserName = await userModel.findOne({ userName });
    if (duplicateUserName) {
        throw new Error("Pick another username.");
    }

    const duplicatePhone = await userModel.findOne({ phone });
    if (duplicatePhone) {
        throw new Error("Phone No already exists.");
    }

    const duplicateEmail = await userModel.findOne({ email });
    if (duplicateEmail) {
        throw new Error("Email already exists.");
    }

    user = new userModel({
        firstName,
        lastName,
        userName,
        phone,
        email,
        password,
        profilePic
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
        userId: user.id,
        email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });

    return { token };
};

const userSignin = async (parent, args) => {
    const { email, password } = args;
    if (!email) {
        throw new Error("Please provide email.");
    }

    if (!password) {
        throw new Error("Please provide password.");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const payload = {
        userId: user.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });

    return { token };
};

module.exports = { userSignUp, userSignin };
