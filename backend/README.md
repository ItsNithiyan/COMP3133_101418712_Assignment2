# Employee Management System

## Backend

This is the backend for the Employee Management System, built with Node.js, Express, MongoDB, and GraphQL.

### Features

- User authentication (Signup/Login)
- CRUD operations for employees
- Search employees by department or position
- GraphQL API

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Access GraphQL Playground at `http://localhost:4000/graphql`.

## GraphQL Mutations

### Signup Mutation
This mutation allows new users to sign up:

```graphql
mutation {
  signup(username: "testuser1", email: "test@example.com", password: "Test@123") {
    id
    username
    email
    token
  }
}
```

### Login Mutation
Users can log in with their username/email and password:

```graphql
query {
  login(username: "testuser1", password: "Test@123") {
    id
    username
    email
    token
  }
}
```

## Conclusion
This backend API provides basic authentication and JWT-secured endpoints for managing employees. It’s built using modern technologies like GraphQL and MongoDB to handle operations efficiently.