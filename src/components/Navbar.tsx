import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

    const navigate = useNavigate();

    return(
        <div className="nav-main-container">
            <div className="search-container">

                <button onClick={() => navigate(-1)}>
                    Back
                </button>
                <Searchbar
                />
                </div>
        </div>
    )
}

export default Navbar;