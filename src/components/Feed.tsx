import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Post from "./Post";
import {  getDocs, collection, serverTimestamp, SnapshotOptions, DocumentData, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { query } from "firebase/firestore"
type PostProps = {
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    update: undefined | boolean;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[];
  };

const Feed: React.FC<PostProps> = ({update, newPost, setNewPost}) => {

    const [posts, setPosts] = useState<DocumentData[]>([]);
    const [feedUpdate, setFeedUpdate] = useState<boolean>(false);
    

    const fetchPosts = async () => {
        setPosts([])
        //const q = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")))
        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")))
        querySnapshot.forEach((doc) => {
            console.log(doc.data().textContent)
            setPosts(prevValue => [...prevValue, doc.data()])
        })
    }

    useEffect(() => {
        update ? setFeedUpdate(true) : setFeedUpdate(false);
        fetchPosts();
        
    },[])

    const postsList = posts.map(item =>
        <li 
        key={item.id}>
        {item.textContent} 
        <br></br>
        <i 
        style={{fontSize: "12px"}}
        >
        by {item.username}
        </i>
        </li>
    )

    const postTest = <div>post test</div>

    return(
        <div className="feed-main-container">
            
           <ul>
            <Post newPost={newPost} setNewPost={setNewPost}/>
            {postsList}
            </ul>
            
        </div>
        
    )
}

export default Feed;