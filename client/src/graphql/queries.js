import { gql } from '@apollo/client';

export const FETCH_ALL_USERS = gql`
  query AllUsers {
    allUsers {
      _id
      firstName
      lastName
      userName
      profilePic
      follow
    }
  }
`;

export const FETCH_USER_DETAILS = gql`
  query UserProfile {
    userProfile {
      firstName
      lastName
      userName
      profilePic
      following 
    }
  }
`;

