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
    
}



const Homepage: React.FC<HomepageProps> = ({name, user, posts, setPosts, update, setUpdate}) => {
    //const [update, setUpdate] = useState<boolean | undefined>(false)
    const [newPost, setNewPost] = useState<DocumentData[]>([])
    console.log(update)
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
            />
        </div>
    )
}

export default Homepage;