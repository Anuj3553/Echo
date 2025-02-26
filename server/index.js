import express from 'express'; // Import the express library
import dotenv from 'dotenv'; // Import the dotenv library
import cors from 'cors'; // Import the cors library
import AuthRoutes from './routes/AuthRoutes.js'; // Import the AuthRoutes file
import MessageRoutes from './routes/MessageRoutes.js'; // Import the MessageRoutes file
import { Server } from 'socket.io'; // Import the Server class from the socket.io library

dotenv.config(); // Load environment variables from the .env file
const app = express(); // Create a new express application

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse incoming requests with JSON payloads

app.use('/uploads/images/', express.static('uploads/images')); // Serve the images from the uploads/images directory
app.use('/uploads/recordings/', express.static('uploads/recordings')); // Serve the recordings from the uploads/recordings directory

app.use('/api/auth', AuthRoutes); // Use the AuthRoutes file for the /api/auth route
app.use("/api/messages", MessageRoutes); // Use the MessageRoutes file for the /api/messages route

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

// Create a new instance of the Server class and pass in the server object created by the app.listen() method. This will create a new instance of the socket.io server that will listen for incoming connections on the same port as the Express server.
const io = new Server(server, {
    cors: { // Configure the CORS settings for the socket.io server to allow requests from the specified origin.
        origin: "http://localhost:3000", // Allow requests from the specified origin
    },
});

// global: This is a global object in Node.js that provides a way to define global variables. Variables attached to global are accessible from anywhere in the Node.js application.
// onlineUsers: This is the name of the global variable being created.
// new Map(): This creates a new instance of the Map object. A Map is a collection of key-value pairs where both keys and values can be of any type.

global.onlineUsers = new Map(); // Map to store online users 

// io.on(): This is an event listener that listens for incoming connections to the socket.io server.
io.on('connection', (socket) => { // connection: This event is triggered when a new client connects to the socket.io server.
    global.chatSocket = socket; // Store the socket object in the global object so that it can be accessed from other parts of the application.
    socket.on("add-user", (userId) => { // add-user: This event is triggered when a new user connects to the socket.io server.
        onlineUsers.set(userId, socket.id); // Add the user to the onlineUsers map with the user's ID as the key and the socket ID as the value.
        socket.broadcast.emit("online-users", { // Emit an "online-users" event to all connected clients with the updated list of online users.
            onlineUsers: Array.from(onlineUsers.keys()), // Convert the onlineUsers map to an array of user IDs.
        });
    });

    socket.on("signout", (id) => { // signout: This event is triggered when a user signs out of the application.
        onlineUsers.delete(id); // Remove the user from the onlineUsers map.
        socket.broadcast.emit("online-users", { // Emit an "online-users" event to all connected clients with the updated list of online users.
            onlineUsers: Array.from(onlineUsers.keys()), // Convert the onlineUsers map to an array of user IDs.
        })
    })

    socket.on("send-msg", (data) => { // send-msg: This event is triggered when a user sends a message to another user.
        const sendUserSocket = onlineUsers.get(data.to); // Get the socket ID of the user to whom the message is being sent.
        if (sendUserSocket) { // Check if the user is online.
            socket.to(sendUserSocket).emit("msg-receive", { // Emit a "msg-receive" event to the user's socket with the message data.
                from: data.from, // Send the message from the user
                message: data.message, // Send the message data
            });
        }
    });

    socket.on("outgoing-voice-call", (data) => { // outoging-voice-call: This event is triggered when a user initiates a voice call.
        const sendUserSocket = onlineUsers.get(data.to); // Get the socket ID of the user to whom the call is being made.
        if (sendUserSocket) { // Check if the user is online.
            socket.to(sendUserSocket).emit("incoming-voice-call", { // Emit an "incoming-voice-call" event to the user's socket with the call data.
                from: data.from, // Send the call from the user
                roomId: data.roomId, // Send the room ID
                callType: data.callType, // Send the call type
            });
        }
    });

    socket.on("outgoing-video-call", (data) => { // outgoing-video-call: This event is triggered when a user initiates a video call.
        const sendUserSocket = onlineUsers.get(data.to); // Get the socket ID of the user to whom the call is being made.
        if (sendUserSocket) { // Check if the user is online.
            socket.to(sendUserSocket).emit("incoming-video-call", { // Emit an "incoming-video-call" event to the user's socket with the call data.
                from: data.from, // Send the call from the user
                roomId: data.roomId, // Send the room ID
                callType: data.callType, // Send the call type
            });
        }
    });

    socket.on("reject-voice-call", (data) => { // reject-voice-call: This event is triggered when a user rejects a voice call.
        const sendUserSocket = onlineUsers.get(data.from); // Get the socket ID of the user who initiated the call.
        if (sendUserSocket) { // Check if the user is online.
            socket.to(sendUserSocket).emit("voice-call-rejected"); // Emit a "voice-call-rejected" event to the user's socket.
        }
    });

    socket.on("reject-video-call", (data) => { // reject-video-call: This event is triggered when a user rejects a video call.
        const sendUserSocket = onlineUsers.get(data.from); // Get the socket ID of the user who initiated the call.
        if (sendUserSocket) { // Check if the user is online.
            socket.to(sendUserSocket).emit("video-call-rejected"); // Emit a "video-call-rejected" event to the user's socket.
        }
    });

    socket.on("accept-incoming-call", (data) => { // accept-incoming-call: This event is triggered when a user accepts a voice call.
        const sendUserSocket = onlineUsers.get(data.id); // Get the socket ID of the user who initiated the call.
        socket.to(sendUserSocket).emit("accept-call"); // Emit an "accept-call" event to the user's socket.
    });
});