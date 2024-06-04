const { userSignUp, userSignin } = require('../controllers/auth');
const { userProfile, allUsers, followUser, unfollowUser } = require('../controllers/user');

const resolvers = {
    Query: {
        userProfile,
        allUsers,
    },
    Mutation: {
        userSignUp,
        userSignin,
        followUser,
        unfollowUser,
    },
};

module.exports = resolvers;