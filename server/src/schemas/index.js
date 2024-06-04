const { gql } = require('apollo-server');

const typeDefs = gql`
type User {
  _id: ID
  firstName: String
  lastName: String
  userName: String
  phone: String
  email: String
  password: String
  profilePic: String
  follow: Boolean
  following:[ID]
}


  type AuthPayload {
    token: String
  }

  type Query {
    userProfile: User
    allUsers: [User]
  }

  type Mutation {
    userSignUp(
      firstName: String
      lastName: String
      userName: String
      phone: String
      email: String
      password: String
      profilePic: String
      following:[ID]
    ): AuthPayload
      password: String!
    userSignin(email: String!, password: String!): AuthPayload
    followUser(treatedUserId: ID!):AuthPayload
    unfollowUser(treatedUserId: ID!):AuthPayload
  }
`;

module.exports = typeDefs;
