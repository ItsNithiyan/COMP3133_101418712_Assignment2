Overview
This project is a backend implementation of an Employee Management System built using Node.js, Express, GraphQL, and MongoDB. It allows users to sign up and log in, and provides admins with the ability to manage employee records.

Features
User Signup: Users can create an account using a username, email, and password.
User Login: Users can log in using their username or email with their password.
JWT Authentication: All API requests require a valid JWT token after login

GraphQL Mutations
Signup Mutation
This mutation allows new users to sign up:

graphql
Copy
Edit
mutation {
  signup(username: "testuser1", email: "test@examplqe.com", password: "Test@123") {
    id
    username
    email
    token
  }
}

Login Mutation
Users can log in with their username/email and password:

graphql
Copy
Edit
query {
  login(username: "testuser1", password: "Test@123") {
    id
    username
    email
    token
  }
}

Conclusion
This backend API provides basic authentication and JWT-secured endpoints for managing users. It’s built using modern technologies like GraphQL and MongoDB to handle user-related operations efficiently.