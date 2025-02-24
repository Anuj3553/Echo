import { reducerCases } from "./constants"; // import the reducerCases object from the constants file

// create a new object called initialState
export const initialState = {
    userInfo: undefined, // set the userInfo property to undefined
    newUser: false, // set the newUser property to false
    contactsPage: false, // set the contactsPage property to false
    currentChatUser: undefined, // set the currentChatUser property to undefined
    messages: [], // set the messages property to an empty array
    socket: undefined, // set the socket property to undefined
    messagesSearch: false // set the messagesSearch property to false
}

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
        default: // default case that returns the state
            return state; // return the state
    }
}

export default reducer; // export the reducer function