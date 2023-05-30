import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Post from "./Post";
import {
    getDocs, 
    collection, 
    serverTimestamp, 
    SnapshotOptions, 
    DocumentData, 
    orderBy, 
    setDoc, 
    doc } 
    from "firebase/firestore";
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
    name:string;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    update: undefined | boolean;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[];
    user: UserProps;
    posts: DocumentData[];
    setPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    bookmarkPosts?: DocumentData[];
    setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
  };

const Feed: React.FC<PostProps> = ({
    name,
    setUpdate,
    update, 
    newPost, 
    setNewPost, 
    user, 
    posts, 
    setPosts,
    bookmarkPosts, 
    setBookmarkPosts
    }) => {

    //const [posts, setPosts] = useState<DocumentData[]>([]);
    const [feedUpdate, setFeedUpdate] = useState<boolean>(false);
    

    const fetchPosts = async () => {
        
        //const q = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")))
        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
        console.log("fetch!")
        setPosts([])
        querySnapshot.forEach((doc) => {

            setPosts(prevValue => [...prevValue, doc.data()])
        })
        
    }

    useEffect(() => {
        //update ? setFeedUpdate(true) : setFeedUpdate(false);
        
        fetchPosts();
        
    },[])


    return(
        <div className="feed-main-container" key={Math.floor(Math.random() * (1000 - 1) + 1)}>
            
          
            <Post 
            name={name}
            newPost={newPost}
            setNewPost={setNewPost}
            update={update}
            setUpdate={setUpdate}
            posts={posts}
            user={user}
            bookmarkPosts={bookmarkPosts} 
            setBookmarkPosts={setBookmarkPosts}
            />
           
            
        </div>
        
    )
}

export default Feed;