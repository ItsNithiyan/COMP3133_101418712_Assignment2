// schema.js
const { gql } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Employee = require('./models/Employee');

// GraphQL type definitions
const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
    token: String
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
    created_at: Date
    updated_at: Date
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo: String
  }

  type Query {
    # Login using username or email along with password.
    login(username: String, email: String, password: String!): User

    # Retrieve all employee records.
    getAllEmployees: [Employee]

    # Retrieve a single employee by ID.
    searchEmployeeByEid(eid: ID!): Employee

    # Retrieve employees by designation and/or department.
    searchEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee]
  }

  type Mutation {
    # Create a new user account.
    signup(username: String!, email: String!, password: String!): User

    # Add a new employee record.
    addEmployee(input: EmployeeInput!): Employee

    # Update an employee record by ID.
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): Employee

    # Delete an employee record by ID.
    deleteEmployeeByEid(eid: ID!): String
  }
`;

// Resolvers for GraphQL operations
const resolvers = {
  Query: {
    async login(_, { username, email, password }, { JWT_SECRET }) {
      try {
        let user;
        if (username) {
          user = await User.findOne({ username });
        } else if (email) {
          user = await User.findOne({ email });
        }
        if (!user) throw new Error("User not found");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Incorrect password");

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
          token
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async getAllEmployees() {
      try {
        return await Employee.find({});
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async searchEmployeeByEid(_, { eid }) {
      try {
        const employee = await Employee.findById(eid);
        if (!employee) throw new Error("Employee not found");
        return employee;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async searchEmployeeByDesignationOrDepartment(_, { designation, department }) {
      try {
        let query = {};
        if (designation) query.designation = designation;
        if (department) query.department = department;
        return await Employee.find(query);
      } catch (err) {
        throw new Error(err.message);
      }
    }
  },
  Mutation: {
    async signup(_, { username, email, password }, { JWT_SECRET }) {
      try {
        // Check if a user with the same username or email exists.
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) throw new Error("Username or Email already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          username,
          email,
          password: hashedPassword
        });
        await user.save();

        // Generate JWT token.
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
          token
        };
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async addEmployee(_, { input }) {
      try {
        const employee = new Employee({ ...input });
        await employee.save();
        return employee;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async updateEmployeeByEid(_, { eid, input }) {
      try {
        const employee = await Employee.findByIdAndUpdate(eid, { ...input, updated_at: Date.now() }, { new: true });
        if (!employee) throw new Error("Employee not found");
        return employee;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async deleteEmployeeByEid(_, { eid }) {
      try {
        const employee = await Employee.findByIdAndDelete(eid);
        if (!employee) throw new Error("Employee not found");
        return "Employee deleted successfully";
      } catch (err) {
        throw new Error(err.message);
      }
    }
  }
};

module.exports = { typeDefs, resolvers };
