import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";

// type UserProps = {
//     authProvider?: string;
//     email: string;
//     name?: string;
//     uid: string;
// }  
// type PostProps = {
//     //setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
//     // setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
//     // post?: DocumentData;
//     // newPost: DocumentData[];
//     //update: undefined | boolean;
//     user: UserProps;
//   };
const Navbar = () => {

    return(
        <div className="nav-main-container">
            Navbar
            <div className="search-container">
                <div>
                <Searchbar
                />
                </div>
            </div>
        </div>
    )
}

export default Navbar;