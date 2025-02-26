import { Router } from "express";
import { checkUser, generateToken, getAllUsers, onBoardUser } from "../controllers/AuthController.js";

const router = Router() // Create a new router

router.post("/check-user", checkUser); // Create a POST route to check if the user exists
router.post("/onboard-user", onBoardUser); // Create a POST route to onboard the user
router.get("/get-contacts", getAllUsers); // Create a GET route to get all users
router.get("/generate-token/:userId", generateToken); // Create a GET route to generate a token

export default router; // Export the router
