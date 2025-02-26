import getPrismaInstance from "../utils/PrismaClient.js"; // Import the getPrismaInstance function from utils/PrismaClient.js
import { generateToken04 } from "../utils/TokenGenerator.js"; // Import the generateToken04 function from utils/ZeogToken.js

// Create a function to check if the user exists
export const checkUser = async (req, res, next) => {
    try {
        const { email } = req.body; // Get the email from the request body
        if (!email) { // If the email is not provided
            return res.json({ msg: "Email is required", status: false }) // Return an error response
        }

        const prisma = getPrismaInstance(); // Get the PrismaClient instance

        // Find a user with the provided email
        const user = await prisma.user.findUnique({
            where: {
                email // Find a user with the provided email
            }
        });

        if (!user) { // If the user does not exist
            return res.json({ msg: "User not found", status: false }) // Return an error response
        } else { // If the user exists
            return res.json({ msg: "User found", status: true, data: user }) // Return a success response
        }
    } catch (err) {
        next(err); // Pass the error to the error handler
    }
};

export const onBoardUser = async (req, res, next) => {
    try {
        const { email, name, about, image: profilePicture } = req.body; // Get the email, name, about, and profilePicture from the request body

        if (!email || !name || !profilePicture) { // If the email or name is not provided
            return res.send("Email, Name and Image are required.") // Return an error response
        }

        const prisma = getPrismaInstance(); // Get the PrismaClient instance

        const user = await prisma.user.create({ // Create a new user
            data: {
                email, // Set the email
                name, // Set the name
                about, // Set the about
                profilePicture // Set the profilePicture
            }
        });

        return res.json({ msg: "Success", status: true, user }) // Return a success response
    } catch (err) {
        next(err); // Pass the error to the error handler
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance(); // Get the PrismaClient instance
        const users = await prisma.user.findMany({
            orderBy: { // Order the users by name in ascending order
                name: 'asc' // Order the users by name in ascending order
            },
            select: { // Select the following fields
                id: true, // Select the id field
                email: true, // Select the email field
                name: true, // Select the name field
                profilePicture: true, // Select the profilePicture field
                about: true, // Select the about field
            }
        });

        // Create an empty object to store the users grouped by the initial letter of their name
        const userGroupByInitialLetter = {};
        // Loop through the users
        users.forEach(user => {
            const initialLetter = user.name.charAt(0).toUpperCase(); // Get the first letter of the user's name
            if (!userGroupByInitialLetter[initialLetter]) { // If the initial letter does not exist in the object
                userGroupByInitialLetter[initialLetter] = []; // Create an empty array
            }
            userGroupByInitialLetter[initialLetter].push(user); // Push the user to the array
        });

        return res.status(200).send({ users: userGroupByInitialLetter }); // Return a success response
    } catch (err) {
        next(err); // Pass the error to the error handler
    }
}

export const generateToken = async (req, res, next) => {
    try {
        const appId = parseInt(process.env.ZEGO_APP_ID); // Get the ZEOG_APP_ID from the environment variables
        const userId = req.params.userId; // Get the userId from the request parameters
        const serverSecret = process.env.ZEGO_SERVER_SECRET; // Get the ZEGO_SERVER_SECRET from the environment variables
        const effectiveTime = 3600; // Set the effective time to 3600 seconds
        const payload = ""; // Create an empty payload

        // Validate required fields
        if (!appId || !serverSecret || !userId) {
            return res.status(400).send("App ID, Server Secret, and User ID are required."); // Return an error response
        }

        // Generate the token
        const token = generateToken04(
            appId,
            userId,
            serverSecret,
            effectiveTime,
            payload
        );

        // Return the token
        return res.status(200).json({ token });
    } catch (err) {
        next(err); // Pass the error to the error handler
    }
};