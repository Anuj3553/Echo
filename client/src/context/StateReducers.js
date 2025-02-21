import { reducerCases } from "./constants"; // import the reducerCases object from the constants file

// create a new object called initialState
export const initialState = {
    userInfo: undefined, // set the userInfo property to undefined
    newUser: false, // set the newUser property to false
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
        default: // default case that returns the state
            return state; // return the state
    }
}

export default reducer; // export the reducer function