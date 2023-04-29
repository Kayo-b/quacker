import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  getDocs, collection, serverTimestamp, SnapshotOptions, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
type PostProps = {
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    update: undefined | boolean;
  };

const Feed: React.FC<PostProps> = ({update}) => {

    const [posts, setPosts] = useState<DocumentData[]>([]);
    const [feedUpdate, setFeedUpdate] = useState<boolean>(false);
    

    const fetchPosts = async () => {
        setPosts([])
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
            console.log(doc.data().textContent)

            setPosts(prevValue => [...prevValue, doc.data()])
                
        })
        
    }
    useEffect(() => {
        update ? setFeedUpdate(true) : setFeedUpdate(false);
        fetchPosts()
    },[update])
    console.log(posts)
    return(
        <div className="feed-main-container">
            
            {posts.map(item => {
                return (
                    <p>{item.textContent}</p>)
            })}
            
            
        </div>
    )
}

export default Feed;