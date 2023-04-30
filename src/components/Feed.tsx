import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  getDocs, collection, serverTimestamp, SnapshotOptions, DocumentData, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { query } from "firebase/firestore"
type PostProps = {
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    update: undefined | boolean;
  };

const Feed: React.FC<PostProps> = ({update}) => {

    const [posts, setPosts] = useState<DocumentData[]>([]);
    const [feedUpdate, setFeedUpdate] = useState<boolean>(false);
    

    const fetchPosts = async () => {
        setPosts([])
        const q = await getDocs(query(collection(db, "posts"), orderBy("serverTimestamp")))
        console.log(q.query)
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

    return(
        <div className="feed-main-container">
           <ul>{postsList}</ul>
            
        </div>
    )
}

export default Feed;