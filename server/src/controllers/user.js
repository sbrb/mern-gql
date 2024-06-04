const userModel = require('../models/userModel');
const verifyToken = require('../utils/verifyToken');

const userProfile = async (_, args, context) => {
    try {
        const userId = verifyToken(context);
        if (!userId) {
            throw new Error('Unauthorized');
        }
        const user = await userModel.findById(userId);
        return user;
    } catch (err) {
        throw new Error('Error in userProfile: ' + err.message);
    }
};

const allUsers = async (_, __, context) => {
    try {
        const userId = verifyToken(context);
        if (!userId) {
            throw new Error('Unauthorized');
        }

        const users = await userModel.find();
        const loggedInUser = await userModel.findById(userId);
        const followingIdsSet = new Set(loggedInUser.following.map(user => user.toString()));

        return users.filter(user => user._id.toString() !== userId).map(user => ({
            ...user.toObject(),
            follow: followingIdsSet.has(user._id.toString()),
        }));
    } catch (err) {
        throw new Error('Error fetching users: ' + err.message);
    }
};

const followUser = async (_, { treatedUserId }, context) => {
    try {
        const userId = verifyToken(context);
        if (!userId) {
            throw new Error('Unauthorized');
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.following.includes(treatedUserId)) {
            user.following.push(treatedUserId);
            await user.save();
        } else {
            throw new Error('You are already following.');
        }

        return user;
    } catch (err) {
        throw new Error('Error in followUser: ' + err.message);
    }
};

const unfollowUser = async (_, { treatedUserId }, context) => {
    try {
        const userId = verifyToken(context);
        if (!userId) {
            throw new Error('Unauthorized');
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.following = user.following.filter(followId => followId.toString() !== treatedUserId);
        await user.save();

        return user;
    } catch (err) {
        throw new Error('Error in unfollowUser: ' + err.message);
    }
};

module.exports = { userProfile, allUsers, followUser, unfollowUser };
