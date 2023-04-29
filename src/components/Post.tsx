import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

type PostProps = {
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    update: undefined | boolean;
  };

const Post: React.FC<PostProps> = ({setUpdate, update}) => {
const[text, setText] = useState("");
const handleClick = async (text: String | Number) => {
    update ? setUpdate(false) : setUpdate(true);
    // handle form submission here
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            textContent: text
        })
    } catch(e) {
        console.error(e);
    }
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

export default Post;