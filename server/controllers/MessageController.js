import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";

export const addMessage = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance(); // Get the Prisma client instance

        const { message, from, to } = req.body; // Extract the message, from, and to fields from the request body

        const getUser = onlineUsers.get(to); // Get the user from the onlineUsers Map

        if (message && from && to) { // Check if the message, from, and to fields are present in the request body
            const newMessage = await prisma.messages.create({ // Create a new message in the database
                data: {
                    message,
                    sender: { connect: { id: parseInt(from) } }, // Connect the sender to the message
                    receiver: { connect: { id: parseInt(to) } }, // Connect the receiver to the message
                    messageStatus: getUser ? "delivered" : "sent" // Set the message status to delivered if the user is online, otherwise set it to sent
                },
                include: { sender: true, receiver: true } // Include the sender and receiver fields in the response because they are required 
            });
            return res.status(201).send({ message: newMessage })
        }

        return res.status(400).send("From, To and Message is required.");
    } catch (error) {
        next(error);

        // Ensure error is a valid object
        const errorDetails = error instanceof Error ? {
            message: error.message,
            stack: error.stack,
        } : {
            message: "Unknown error occurred",
            details: error,
        };

        console.error("❌ Error submitting application:", errorDetails);

        // Return a valid error response
        return Response.json(
            { error: "Internal Server Error", details: errorDetails },
            { status: 500 }
        );
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance(); // Get the Prisma client instance

        const { from, to } = req.params; // Extract the from and to fields from the query parameters

        // Find all messages between two users
        const messages = await prisma.messages.findMany({ // Find all messages between two users
            where: { // Filter the messages based on the sender and receiver ids
                OR: [ // Use the OR operator to check for messages sent in both directions
                    { senderId: parseInt(from), receiverId: parseInt(to) }, // Check for messages sent from the sender to the receiver
                    { senderId: parseInt(to), receiverId: parseInt(from) } // Check for messages sent from the receiver to the sender
                ]
            },
            orderBy: {
                id: "asc" // Order the messages by their id in ascending order
            },
        });

        const unreadMessages = []; // Create an array to store unread messages

        messages.forEach = ((message, index) => { // Iterate over the messages array
            if (message.messageStatus !== "read" && message.receiverId === parseInt(to)) { // Check if the message status is not read and the receiver id is the same as the current user
                messages[index].messageStatus = "read"; // Update the message status to read
                unreadMessages.push(message.id); // Add the message to the unreadMessages array
            }
        });

        await prisma.messages.updateMany({ // Update the message status for all unread messages
            where: { // Filter the messages based on their ids
                id: { in: unreadMessages } // Check if the message id is in the unreadMessages array
            },
            data: { messageStatus: "read" }, // Update the message status to read
        });

        res.status(200).json({ messages }); // Return the messages array in the response
    } catch (err) {
        next(err);
    }
}

export const addImageMessage = async (req, res, next) => {
    try {
        if (req.file) { // Check if the file is present in the request
            const date = Date.now(); // Get the current date and time
            let fileName = "uploads/images/" + date + req.file.originalname; // Create a unique file name
            renameSync(req.file.path, fileName); // Rename the file with the unique file name

            const prisma = getPrismaInstance(); // Get the Prisma client instance
            const { from, to } = req.query; // Extract the from and to fields from the query parameters

            if (from && to) { // Check if the from and to fields are present in the query parameters
                const message = await prisma.messages.create({ // Create a new message in the database
                    data: { // Set the message data
                        message: fileName, // Set the message to the file name
                        sender: { connect: { id: parseInt(from) } }, // Connect the sender to the message
                        receiver: { connect: { id: parseInt(to) } }, // Connect the receiver to the message
                        type: "image", // Set the message type to image
                    },
                });
                return res.status(201).json({ message }); // Return the message in the response
            }
            return res.status(400).send("From, To and Message is required."); // Return an error response if the from, to, and message fields are not present
        }

        return res.status(400).send("Image is required."); // Return an error response if the image is not present
    } catch (error) {
        next(error);

        // Ensure error is a valid object
        const errorDetails = error instanceof Error ? {
            message: error.message,
            stack: error.stack,
        } : {
            message: "Unknown error occurred",
            details: error,
        };

        console.error("❌ Error submitting application:", errorDetails);

        // Return a valid error response
        return Response.json(
            { error: "Internal Server Error", details: errorDetails },
            { status: 500 }
        );
    }
}

export const addAudioMessage = async (req, res, next) => {
    try {
        if (req.file) { // Check if the file is present in the request
            const date = Date.now(); // Get the current date and time
            let fileName = "uploads/recordings/" + date + req.file.originalname; // Create a unique file name
            renameSync(req.file.path, fileName); // Rename the file with the unique file name

            const prisma = getPrismaInstance(); // Get the Prisma client instance
            const { from, to } = req.query; // Extract the from and to fields from the query parameters

            if (from && to) { // Check if the from and to fields are present in the query parameters
                const message = await prisma.messages.create({ // Create a new message in the database
                    data: { // Set the message data
                        message: fileName, // Set the message to the file name
                        sender: { connect: { id: parseInt(from) } }, // Connect the sender to the message
                        receiver: { connect: { id: parseInt(to) } }, // Connect the receiver to the message
                        type: "audio", // Set the message type to image
                    },
                });
                return res.status(201).json({ message }); // Return the message in the response
            }
            return res.status(400).send("From, To and Message is required."); // Return an error response if the from, to, and message fields are not present
        }

        return res.status(400).send("Audio is required."); // Return an error response if the image is not present
    } catch (error) {
        next(error);

        // Ensure error is a valid object
        const errorDetails = error instanceof Error ? {
            message: error.message,
            stack: error.stack,
        } : {
            message: "Unknown error occurred",
            details: error,
        };

        console.error("❌ Error submitting application:", errorDetails);

        // Return a valid error response
        return Response.json(
            { error: "Internal Server Error", details: errorDetails },
            { status: 500 }
        );
    }
}

export const getInitialContactswithMessages = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.from); // Extract the userId from the request parameters
        const prisma = getPrismaInstance(); // Get the Prisma client instance
        const user = await prisma.user.findUnique({ // Find the user by their id
            where: { id: userId }, // Filter the user based on their id
            include: { // Include the sent and received messages in the response
                sentMessages: { // Include the sent messages
                    include: {
                        receiver: true, // Include the receiver of the message
                        sender: true, // Include the sender of the message
                    },
                    orderBy: { // Order the messages by their creation date
                        createdAt: "desc", // Order the messages by their creation date in descending order
                    },
                },
                receivedMessages: { // Include the received messages
                    include: { // Include the sender of the message
                        receiver: true, // Include the receiver of the message
                        sender: true, // Include the sender of the message
                    },
                    orderBy: { // Order the messages by their creation date
                        createdAt: "desc", // Order the messages by their creation date in descending order
                    },
                }
            }
        });

        const messages = [...user.sentMessages, ...user.receivedMessages]; // Combine the sent and received messages into a single array
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort the messages in descending order based on their creation date
        const users = new Map(); // Create a new Map to store the users
        const messageStatusChange = []; // Create an array to store the message status changes
        messages.forEach((msg) => { // Iterate over the messages array
            const isSender = msg.senderId === userId; // Check if the current user is the sender of the message
            const calculatedId = isSender ? msg.receiverId : msg.senderId; // Calculate the id of the other user
            if (msg.messageStatus === "sent") { // Check if the message status is sent
                messageStatusChange.push(msg.id); // Add the message to the messageStatusChange array
            }

            // Extract the id, type, message, messageStatus, createdAt, senderId, and receiverId fields from the message
            const {
                id,
                type,
                message,
                messageStatus,
                createdAt,
                senderId,
                receiverId,
            } = msg;

            if (!users.get(calculatedId)) { // Check if the user is not present in the users Map
                let user = { // Create a new user object
                    messageId: id, // Set the message id
                    type, // Set the message type
                    message, // Set the message
                    messageStatus, // Set the message status
                    createdAt, // Set the message creation date
                    senderId, // Set the sender id
                    receiverId, // Set the receiver id
                };

                if (isSender) { // Check if the current user is the sender of the message
                    user = { // Update the user object
                        ...user, // Spread the existing user object
                        ...msg.receiver, // Spread the receiver object
                        totalUnreadMessages: 0, // Set the totalUnreadMessages to 0
                    };
                } else {
                    user = { // Update the user object
                        ...user, // Spread the existing user object
                        ...msg.sender, // Spread the sender object
                        totalUnreadMessages: messageStatus !== "read" ? 1 : 0, // Set the totalUnreadMessages to 1 if the message status is not read
                    };
                }
                users.set(calculatedId, { ...user }); // Add the user to the users Map
            } else if (messageStatus !== "read" && !isSender) { // Check if the message status is not read and the current user is not the sender
                const user = users.get(calculatedId); // Get the user from the users Map
                users.set(calculatedId, { // Update the user object
                    ...user, // Spread the existing user object
                    totalUnreadMessages: user.totalUnreadMessages + 1, // Increment the totalUnreadMessages by 1
                });
            }
        })

        if (messageStatusChange.length) {
            await prisma.messages.updateMany({ // Update the message status for all unread messages
                where: { // Filter the messages based on their ids
                    id: { in: messageStatusChange } // Check if the message id is in the unreadMessages array
                },
                data: { messageStatus: "delivered" }, // Update the message status to read
            });
        }

        res.status(200).json({
            users: Array.from(users.values()), // Convert the users Map to an array
            onlineUsers: Array.from(onlineUsers.keys()), // Convert the onlineUsers Map to an array
        });
    } catch (err) { // Catch any errors that occur
        next(err); // Pass the error to the error handling middleware
    }
}