import { Router } from "express"; // Import express
import { addImageMessage, addMessage, getMessages } from "../controllers/MessageController.js"; // Import the message controller
import multer from "multer"; // Import multer for file uploads

const router = Router() // Create a new router instance

const uploadImage = multer({ dest: "uploads/images" }) // Create a new multer instance for image uploads

router.post("/add-message", addMessage); // Create a new message
router.get("/get-messages/:from/:to", getMessages); // Get messages between two users
router.post("/add-image-message", uploadImage.single("image"), addImageMessage); // Add an image message to the chat

export default router; // Export the router