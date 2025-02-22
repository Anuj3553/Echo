import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes.js';
import MessageRoutes from './routes/MessageRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', AuthRoutes);
app.use("/api/messages", MessageRoutes);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

// global: This is a global object in Node.js that provides a way to define global variables. Variables attached to global are accessible from anywhere in the Node.js application.
// onlineUsers: This is the name of the global variable being created.
// new Map(): This creates a new instance of the Map object. A Map is a collection of key-value pairs where both keys and values can be of any type.

global.onlineUsers = new Map(); // Map to store online users 

