// server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./schema');

const app = express();
app.use(express.json());

// Directly include configuration values (replace with your sensitive data appropriately)
const MONGO_URI = "mongodb+srv://nithiyan:NithiyanUkt18@mycluster.cjb8b.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";
const JWT_SECRET = "secretkey";  // You can change this to any secret string
const PORT = 4000;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Initialize Apollo Server with the JWT secret passed to context for resolver use.
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Optionally extract token from request headers for further authentication.
      return { req, JWT_SECRET };
    },
  });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
