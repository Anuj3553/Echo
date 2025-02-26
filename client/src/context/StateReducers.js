import { reducerCases } from "./constants"; // import the reducerCases object from the constants file

// create a new object called initialState
export const initialState = {
    userInfo: undefined, // set the userInfo property to undefined
    newUser: false, // set the newUser property to false
    contactsPage: false, // set the contactsPage property to false
    currentChatUser: undefined, // set the currentChatUser property to undefined
    messages: [], // set the messages property to an empty array
    socket: undefined, // set the socket property to undefined
    messagesSearch: false, // set the messagesSearch property to false
    userContacts: [], // set the userContacts property to an empty array
    onlineUsers: [], // set the onlineUsers property to an empty array
    contactSearch: "", // set the contactSearch property to an empty string
    filteredContacts: [], // set the messages property to an empty array
    videoCall: undefined, // set the videoCall property to undefined
    voiceCall: undefined, // set the voiceCall property to undefined
    incomingVoiceCall: undefined, // set the incomingVoiceCall property to undefined
    incomingVideoCall: undefined, // set the incomingVideoCall property to undefined
};

// create a new function called reducer that takes in state and action as arguments
const reducer = (state, action) => {
    switch (action.type) { // switch statement that checks the action type
        case reducerCases.SET_USER_INFO: // check if the action type is SET_USER_INFO
            return {
                ...state, // return a new object with the state
                userInfo: action.userInfo, // set the userInfo property to the action payload
            };
        case reducerCases.SET_NEW_USER: // check if the action type is SET_NEW_USER
            return {
                ...state, // return a new object with the state
                newUser: action.newUser, // set the userInfo property to the action payload
            };
        case reducerCases.SET_ALL_CONTACTS_PAGE: // check if the action type is SET_ALL_CONTACTS_PAGE
            return {
                ...state, // return a new object with the state
                contactsPage: !state.contactsPage, // set the contactsPage property to the action payload
            };
        case reducerCases.CHANGE_CURRENT_CHAT_USER: // check if the action type is CHANGE_CURRENT_CHAT_USER
            return {
                ...state, // return a new object with the state
                currentChatUser: action.user, // set the currentChatUser property to the action payload
            };
        case reducerCases.SET_MESSAGES: // check if the action type is SET_MESSAGES
            return {
                ...state, // return a new object with the state
                messages: action.messages, // set the messages property to the action payload
            };
        case reducerCases.SET_SOCKET: // check if the action type is SET_SOCKET
            return {
                ...state, // return a new object with the state
                socket: action.socket, // set the socket property to the action payload
            };
        case reducerCases.ADD_MESSAGE: // check if the action type is ADD_MESSAGE
            return {
                ...state, // return a new object with the state
                messages: [...state.messages, action.newMessage], // add the new message to the messages array
            };
        case reducerCases.SET_MESSAGE_SEARCH: // check if the action type is SET_MESSAGE_SEARCH
            return {
                ...state, // return a new object with the state
                messagesSearch: !state.messagesSearch, // set the messagesSearch property to the action payload
            }
        case reducerCases.SET_USER_CONTACTS: // check if the action type is SET_USER_CONTACTS
            return {
                ...state, // return a new object with the state
                userContacts: action.userContacts, // set the userContacts property to the action payload
            };
        case reducerCases.SET_ONLINE_USERS: // check if the action type is SET_ONLINE_USERS
            return {
                ...state, // return a new object with the state
                onlineUsers: action.onlineUsers, // set the onlineUsers property to the action payload
            };
        case reducerCases.SET_CONTACT_SEARCH: // check if the action type is SET_CONTACT_SEARCH
            const filteredContacts = state.userContacts.filter((contact) =>
                contact.name.toLowerCase().includes(action.contactSearch?.toLowerCase()
                )); // filter the userContacts based on the search term
            return {
                ...state, // return a new object with the state
                contactSearch: action.contactSearch, // set the contactSearch property to the action payload
                filteredContacts, // set the filteredContacts property to the filtered contacts
            };
        case reducerCases.SET_VIDEO_CALL: // check if the action type is SET_VIDEO_CALL
            return {
                ...state, // return a new object with the state
                videoCall: action.videoCall, // set the videoCall property to the action payload
            };
        case reducerCases.SET_VOICE_CALL: // check if the action type is SET_VOICE_CALL
            return {
                ...state, // return a new object with the state
                voiceCall: action.voiceCall, // set the voiceCall property to the action payload
            };
        case reducerCases.SET_INCOMING_VOICE_CALL: // check if the action type is SET_INCOMING_VOICE_CALL
            return {
                ...state, // return a new object with the state
                incomingVoiceCall: action.incomingVoiceCall, // set the incomingVoiceCall property to the action payload
            };
        case reducerCases.SET_INCOMING_VIDEO_CALL: // check if the action type is SET_INCOMING_VIDEO_CALL
            return {
                ...state, // return a new object with the state
                incomingVideoCall: action.incomingVideoCall, // set the incomingVideoCall property to the action payload
            };
        case reducerCases.END_CALL: // check if the action type is END_CALL
            return {
                ...state, // return a new object with the state
                voiceCall: undefined, // set the voiceCall property to undefined
                videoCall: undefined, // set the videoCall property to undefined
                incomingVideoCall: undefined, // set the incomingVideoCall property to undefined
                incomingVoiceCall: undefined, // set the incomingVoiceCall property to undefined
            };
        default: // default case that returns the state
            return state; // return the state
    }
}

export default reducer; // export the reducer function