import gql from 'graphql-tag'

export const CREATE_USER_BY_EMAIL = gql`    
  mutation signUpByEmail(
      $firstName: String
      $lastName: String
      $email: String!
      $password: String!
    ) {
    signUpByEmail(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
    }
  }`

export const CREATE_USER_BY_PHONE_NUMBER = gql`    
  mutation signUpByPhoneNumber(
      $firstName: String
      $lastName: String
      $phoneNumber: String!
      $password: String!
    ) {
    signUpByPhoneNumber(
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      password: $password
    ) {
      token
    }
  }`