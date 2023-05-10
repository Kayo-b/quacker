import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  addDoc, collection, serverTimestamp, DocumentData, setDoc, doc } from "firebase/firestore";
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
    setUpdate(true);
    // handle form submission here
    try {

        const docRef = await addDoc(collection(db, "posts"), {
            username: name,
            userID: user.uid,
            parentID: null,
            textContent: text,
            likedByUsers: [],
            timestamp: serverTimestamp()
        })
        
        // console.log("Document written with ID: ", docRef);
        setNewPost(prev => [{
            username: name,
            postID: docRef.id,
            parentID: null,
            textContent: text,
            likedByUsers: [],
            timestamp: serverTimestamp()
        }, ...prev]);
        setDoc(docRef, {postID: docRef.id}, {merge: true})
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