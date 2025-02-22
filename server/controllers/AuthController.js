import getPrismaInstance from "../utils/PrismaClient.js"; // Import the getPrismaInstance function from utils/PrismaClient.js

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