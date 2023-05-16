import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Post from "./Post";
import {  getDocs, collection, serverTimestamp, SnapshotOptions, DocumentData, orderBy, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { query } from "firebase/firestore"

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
}  
type PostProps = {
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    update: undefined | boolean;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[];
    user: UserProps
  };

const Feed: React.FC<PostProps> = ({ setUpdate, update, newPost, setNewPost, user }) => {

    const [posts, setPosts] = useState<DocumentData[]>([]);
    const [feedUpdate, setFeedUpdate] = useState<boolean>(false);
    

    const fetchPosts = async () => {
        
        //const q = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")))
        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
        console.log("fetch!")
        setPosts([])
        querySnapshot.forEach((doc) => {
            console.log(doc.data().textContent)
            setPosts(prevValue => [...prevValue, doc.data()])
        })
        
    }

    useEffect(() => {
        //update ? setFeedUpdate(true) : setFeedUpdate(false);
        
        fetchPosts();
        
    },[])

    // const postsList = posts.map(item =>
    //     // <li 
    //     // key={item.postID}>
    //     // {item.textContent} 
    //     // <br></br>
    //     // <i 
    //     // style={{fontSize: "12px"}}
    //     // >
    //     // by {item.username}
    //     // </i>
    //     // </li>
        
       
    // )

    return(
        <div className="feed-main-container">
            
           <ul>
            <Post 
            newPost={newPost}
            setNewPost={setNewPost}
            update={update}
            setUpdate={setUpdate}
            posts={posts}
            user={user}
            />
            </ul>
            
        </div>
        
    )
}

export default Feed;