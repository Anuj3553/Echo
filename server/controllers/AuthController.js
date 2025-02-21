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
        next(err);
    }
}

export const onBoardUser = async (req, res, next) => {
    try {
        const {email, name, about, image: profilePicture} = req.body; // Get the email, name, about, and profilePicture from the request body

        if (!email || !name || !profilePicture) { // If the email or name is not provided
            return res.send("Email, Name and Image are required.") // Return an error response
        }

        const prisma = getPrismaInstance(); // Get the PrismaClient instance

        await prisma.user.create({ // Create a new user
            data: {
                email, // Set the email
                name, // Set the name
                about, // Set the about
                profilePicture // Set the profilePicture
            }
        });

        return res.json({ msg: "Success", status: true }) // Return a success response
    } catch (err) {
        next(err);
    }
}