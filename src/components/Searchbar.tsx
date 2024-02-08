import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import {  addDoc, collection, serverTimestamp, DocumentData, setDoc, doc, arrayUnion} from "firebase/firestore";
import { db } from "../firebase";


// type UserProps = {
//     authProvider?: string;
//     email: string;
//     name?: string;
//     uid: string;
// }  

// type PostProps = {
//     // setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
//     // setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
//     // post?: DocumentData;
//     // newPost: DocumentData[];
//     // update: undefined | boolean;
    
//     user: UserProps;
//   };

const Searchbar = () => {
const[text, setText] = useState("");
const navigate = useNavigate();
const handleClick = async (text: String) => {
    navigate(`/search/${text}`);
  };

    return(
        <div className="search-main-container">
            <div className="searchContainer">
                <div className="searchElem">
                <input
                    type="text"
                    className="search"
                    placeholder="Look for..."
                    onChange={e => setText(e.target.value)}
                    onKeyDown={(e) =>
                    e.key === "Enter" ? handleClick(text) : () => null
                    }
                ></input>
                <button className="searchButton"
                        value="Search" 
                        onClick={() => handleClick(text)}>
                    <IoIosSearch style={{height:'20px', width:'20px'}}/>
                </button> 
        </div>
            </div>
                </div>
        // <div>
        //     <div className="search-main-container">
        //         <input 
        //             type="className="searchButton"" placeholder="Look for..."
        //             value={text} 
        //             onChange={e => setText(e.target.value)}>
        //         </input>
        //         <input 
        //             type="button" value="Search" 
        //             onClick={() => handleClick(text)}>
        //         </input> 
        //     </div>
        // </div>
        )
                    


}

export default Searchbar;