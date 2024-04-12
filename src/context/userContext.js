import { createContext, useState } from "react";

export const UserContext = createContext();
export const UserProvider = (props) => {
    const [userdata,setUserdata]=useState('')
    return (
        <UserContext.Provider value={{userdata,setUserdata}}></UserContext.Provider>)
}