import getPrismaInstance from "../utils/PrismaClient.js";

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

        return res.status(400).send({ message: "From, To and Message is required." });
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