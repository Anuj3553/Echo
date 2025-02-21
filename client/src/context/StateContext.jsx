import { createContext, useContext, useReducer } from "react"; // import the createContext, useContext, and useReducer hooks from react

export const StateContext = createContext(); // create a new context called StateContext

// create a new component called StateProvider that takes in an initialState, a reducer, and children as props
export const StateProvider = ({ initialState, reducer, children }) => {
    return (
        <StateContext.Provider value={useReducer(reducer, initialState)}> 
            {children} 
        </StateContext.Provider>
    );
}

// create a new hook called useStateProvider that returns the useContext hook with the StateContext as an argument
export const useStateProvider = () => useContext(StateContext);