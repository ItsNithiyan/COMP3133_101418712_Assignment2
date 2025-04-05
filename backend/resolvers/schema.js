import { gql } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

// GraphQL type definitions
export const typeDefs = gql`
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
    profile_picture: String
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
    profile_picture: String
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
    profile_picture: String
  }

  type Query {
    login(username: String, email: String, password: String!): User
    getAllEmployees: [Employee]
    searchEmployeeByEid(eid: ID!): Employee
    searchEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    addEmployee(input: EmployeeInput!): Employee
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): Employee
    deleteEmployeeByEid(eid: ID!): String
  }
`;

// Resolvers for GraphQL operations
export const resolvers = {
  Query: {
    async login(_, { username, email, password }, { JWT_SECRET }) {
      try {
        const user = username
          ? await User.findOne({ username })
          : await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Incorrect password");
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        return { id: user._id, username: user.username, email: user.email, token };
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async getAllEmployees() {
      try {
        const employees = await Employee.find({}, 'first_name last_name email designation department profile_picture');
        console.log('Fetched Employees from DB:', employees); // Debug log
        return employees;
      } catch (err) {
        console.error('Error in getAllEmployees:', err.message);
        throw new Error(err.message);
      }
    },
    async searchEmployeeByEid(_, { eid }) {
      try {
        const employee = await Employee.findById(eid, 'first_name last_name email gender designation salary date_of_joining department profile_picture');
        if (!employee) throw new Error("Employee not found");
        return employee;
      } catch (err) {
        console.error('Error in searchEmployeeByEid:', err.message);
        throw new Error(err.message);
      }
    },
    async searchEmployeeByDesignationOrDepartment(_, { designation, department }) {
      try {
        const query = [];
        if (designation) {
          query.push({ designation: { $regex: `^${designation}`, $options: 'i' } });
        }
        if (department) {
          query.push({ department: { $regex: `^${department}`, $options: 'i' } });
        }
        return await Employee.find(query.length > 0 ? { $or: query } : {});
      } catch (err) {
        console.error('Error in searchEmployeeByDesignationOrDepartment:', err.message);
        throw new Error(err.message);
      }
    },
  },
  Mutation: {
    async signup(_, { username, email, password }, { JWT_SECRET }) {
      try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) throw new Error("Username or Email already exists");
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        return { id: user._id, username: user.username, email: user.email, token };
      } catch (err) {
        console.error('Error in signup:', err.message);
        throw new Error(err.message);
      }
    },
    async addEmployee(_, { input }) {
      try {
        console.log('Received Input:', input); // Debug log to verify profile_picture
        const employee = new Employee({ ...input });
        await employee.save();
        console.log('Employee Saved:', employee); // Debug log
        return employee;
      } catch (err) {
        console.error('Error in addEmployee:', err.message);
        throw new Error(err.message);
      }
    },
    async updateEmployeeByEid(_, { eid, input }) {
      try {
        const employee = await Employee.findByIdAndUpdate(
          eid,
          { ...input, updated_at: Date.now() },
          { new: true }
        );
        if (!employee) throw new Error("Employee not found");
        console.log('Updated Employee:', employee);
        return employee;
      } catch (err) {
        console.error('Error in updateEmployeeByEid:', err.message);
        throw new Error(err.message);
      }
    },
    async deleteEmployeeByEid(_, { eid }) {
      try {
        const employee = await Employee.findByIdAndDelete(eid);
        if (!employee) throw new Error("Employee not found");
        return "Employee deleted successfully";
      } catch (err) {
        console.error('Error in deleteEmployeeByEid:', err.message);
        throw new Error(err.message);
      }
    },
  },
};