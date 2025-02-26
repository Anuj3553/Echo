export const HOST = "http://localhost:3005"; // Define the HOST variable

const AUTH_ROUTE = `${HOST}/api/auth`; // Define the AUTH_ROUTE variable
const MESSAGE_ROUTE = `${HOST}/api/messages`; // Define the MESSAGE_ROUTE variable

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`; // Define the CHECK_USER variable
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`; // Define the ONBOARD_USER variable
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`; // Define the GET_ALL_CONTACTS variable
export const GET_CALL_TOKEN = `${AUTH_ROUTE}/generate-token`; // Define the GET_CALL_TOKEN variable


export const ADD_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-message`; // Define the ADD_MESSAGE_ROUTE variable 
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTE}/get-messages` // Define the GET_MESSAGES_ROUTE variable
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-image-message` // Define the ADD_IMAGE_MESSAGE_ROUTE variable
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-audio-message` // Define the ADD_AUDIO_MESSAGE_ROUTE variable
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGE_ROUTE}/get-initial-contacts` // Define the GET_INITIAL_CONTACTS_ROUTE variable
