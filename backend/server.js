import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import multer from 'multer'; // Import multer for file uploads
import path from 'path';
import cors from 'cors'; // Import cors
import { typeDefs, resolvers } from './resolvers/schema.js';

const app = express();
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      console.error('Invalid file type:', file.mimetype); // Log invalid file type
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  },
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const MONGO_URI = "mongodb+srv://nithiyan:NithiyanUkt18@mycluster.cjb8b.mongodb.net/employeemanagement?retryWrites=true&w=majority";
const JWT_SECRET = "secretkey";
const PORT = 4000;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Endpoint for file uploads
app.post('/upload', (req, res) => {
  upload.single('profilePicture')(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err.message); // Log the error
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      console.error('No file uploaded'); // Log the error
      return res.status(400).send('No file uploaded.');
    }
    const filePath = `http://localhost:${PORT}/uploads/${req.file.filename}`; // Ensure full URL is returned
    console.log('File uploaded successfully:', filePath); // Debug log
    res.status(200).json({ filePath }); // Return the full URL
  });
});

// Start Apollo Server
async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req, JWT_SECRET }),
      cache: 'bounded', // Ensure the schema cache is refreshed
    });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error("Apollo Server initialization error:", err);
    process.exit(1);
  }
}

startServer();
