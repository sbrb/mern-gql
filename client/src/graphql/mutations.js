import { gql } from '@apollo/client';

export const SIGN_UP = gql`
    mutation SignUp($firstName: String!, $lastName: String!, $userName: String!, $phone: String!, $email: String!, $password: String!, $profilePic: String) {
        userSignUp( firstName: $firstName, lastName: $lastName, userName: $userName, phone: $phone, email: $email, password: $password, profilePic: $profilePic ) {
            token
        }
    }
`;

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
        userSignin( email: $email, password: $password ) {
            token
        }
    }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($treatedUserId: ID!) {
    followUser(treatedUserId: $treatedUserId) {
      token
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($treatedUserId: ID!) {
    unfollowUser(treatedUserId: $treatedUserId) {
      token
    }
  }
`;
