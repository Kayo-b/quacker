import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DocumentData } from 'firebase/firestore'
import CreatePost from './CreatePost'
import Feed from './Feed'
import Post from "./Post"


type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
    
}  

type HomepageProps = {
    name: string;
    user: UserProps;
    posts: DocumentData[];
    setPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    bookmarkPosts?: DocumentData[];
    setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[] ;
    
}



const Homepage: React.FC<HomepageProps> = ({
    name, 
    user, 
    posts, 
    setPosts, 
    update, 
    setUpdate, 
    bookmarkPosts, 
    setBookmarkPosts,
    newPost,
    setNewPost}) => {
        
    //const [update, setUpdate] = useState<boolean | undefined>(false)
    
    return(
        <div className="home-main-container">
            < CreatePost 
            setUpdate={setUpdate} 
            update={update} 
            name={name} 
            user={user} 
            newPost={newPost} 
            setNewPost={setNewPost}
            />
            < Feed 
            setUpdate={setUpdate} 
            update={update} 
            newPost={newPost} 
            setNewPost={setNewPost} 
            user={user} 
            posts={posts} 
            setPosts={setPosts}
            bookmarkPosts={bookmarkPosts} 
            setBookmarkPosts={setBookmarkPosts}
            name={name}
            
            />
        </div>
    )
}

export default Homepage;