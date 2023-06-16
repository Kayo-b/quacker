import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  addDoc, collection, serverTimestamp, DocumentData, setDoc, doc, arrayUnion } from "firebase/firestore";
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
    post?: DocumentData;
    newPost: DocumentData[];
    update: undefined | boolean;
    name?: string;
    user: UserProps;
  };

const CreatePost: React.FC<PostProps> = ({setUpdate, update, name, user, newPost, setNewPost, post}) => {
const[text, setText] = useState("");

const handleClick = async (text: String) => {
    //setUpdate(true);
    // handle form submission here.

    try {
        const docRef = await addDoc(collection(db, "posts"), {
            username: name,
            userID: user.uid,
            parentID: post ? post.postID : null,
            rootPostID: post ? post.postID : null,
            textContent: text,
            likedByUsers: [],
            repostByUsers: [],
            childComments: [],
            timestamp: serverTimestamp()
        })

        const userDocRef = doc(db, "users", user.uid);
        if(!post) {
            await setDoc(userDocRef, {
                mainFeed: arrayUnion(docRef.id)
            }, {merge: true})
        }
        
        //update === true ? setUpdate(false) : setUpdate(true)
        //setNewPost will add the new post into the newPost array so it 
        //can render the posts into the screen without needing to fetch them.
        setNewPost(prev => [{
            username: name,
            userID: user.uid,
            postID: docRef.id,
            parentID: post ? post.postID : null,
            rootPostID: post ? post.postID : docRef.id,
            textContent: text,
            likedByUsers: [],
            repostByUsers: [],
            childComments: [],
            timestamp: serverTimestamp()
        }, ...prev]);
        //setDoc will add values into doRef after the docRef has been created.
        setDoc(docRef, {
            postID: docRef.id,  
            rootPostID: post ?
            post.rootPostID : 
            docRef.id}, {
                merge: true})
       
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