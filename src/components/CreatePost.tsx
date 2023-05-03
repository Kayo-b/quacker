import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  addDoc, collection, serverTimestamp, DocumentData } from "firebase/firestore";
import { db } from "../firebase";


type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
}  

type PostProps = {
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[];
    update: undefined | boolean;
    name: string;
    user: UserProps;
  };

const CreatePost: React.FC<PostProps> = ({setUpdate, update, name, user, newPost, setNewPost}) => {
const[text, setText] = useState("");
const handleClick = async (text: String) => {
    update ? setUpdate(false) : setUpdate(true);
    // handle form submission here
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            username: name,
            userID: user.uid,
            textContent: text,
            timestamp: serverTimestamp()
        })
        // console.log("Document written with ID: ", docRef);
        setNewPost(prev => [...prev, {
            textContent: text,
            userName: name
        }]);
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

export default CreatePost;