import { Router } from "express"; // Import express
import { addAudioMessage, addImageMessage, addMessage, getInitialContactswithMessages, getMessages } from "../controllers/MessageController.js"; // Import the message controller
import multer from "multer"; // Import multer for file uploads

const router = Router() // Create a new router instance

const uploadAudio = multer({ dest: "uploads/recordings" }) // Create a new multer instance for audio uploads; 
const uploadImage = multer({ dest: "uploads/images" }) // Create a new multer instance for image uploads

router.post("/add-message", addMessage); // Create a new message
router.get("/get-messages/:from/:to", getMessages); // Get messages between two users
router.post("/add-image-message", uploadImage.single("image"), addImageMessage); // Add an image message to the chat
router.post("/add-audio-message", uploadAudio.single("audio"), addAudioMessage); // Add an audio message to the chat
router.get("/get-initial-contacts/:from", getInitialContactswithMessages); // Get the initial contacts with messages

export default router; // Export the router