import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        <div className="post-main-container">     
            <input 
                type="text" placeholder="Say something..."
                value={text} 
                onChange={e => setText(e.target.value)}>
            </input>
            <input 
                type="button" value="Post" 
                onClick={() => handleClick(text)}>
            </input>
        </div>
    )
}

export default Searchbar;