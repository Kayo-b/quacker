import React, { useState, useEffect } from "react";
import Post from "./Post";
import {
    getDocs, 
    collection, 
    serverTimestamp, 
    SnapshotOptions, 
    DocumentData, 
    orderBy, 
    setDoc, 
    doc,
    getFirestore,
    query,
    where,
    addDoc
} 
    from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import myImg from '../img/user-icon.png';
import Like from './Like'
import BookmarkBtn from './BookmarkBtn';

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
}  

type BookmarksProps = { 
    posts: DocumentData[] ;
    user: UserProps;
    bookmarkPosts?: DocumentData[];
    setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}


const Bookmarks: React.FC<BookmarksProps> = ({user, posts, bookmarkPosts, setBookmarkPosts, update, setUpdate}) => {
  //const [bookmarkUpdate, setBookmarkUpdate] = useState<boolean | undefined>() 
  
  useEffect(() => {
    fetchBookmarks();
    console.log("useEffect")

  },[])
    
    
    const fetchBookmarks = async () => {
      
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        console.log(q)
        const docs = await getDocs(q);
        let tempBookmarks: DocumentData[] = [];
        console.log("fetch!book1")
        console.log(docs.docs)
        docs.forEach(doc => {
            const bookmarks = doc.data().bookmarks;
            console.log("fetch!book2")
            console.log(bookmarks)
            tempBookmarks.push(...bookmarks)
        })

        let tempPosts: DocumentData[] = [];
        for (const bm of tempBookmarks) {
          console.log("fetch!book3")
            const q = query(collection(db, "posts"), where("postID", "==", bm));
            const docs = await getDocs(q);
            docs.forEach(doc => {
                tempPosts.push(doc.data());
            });
            
        }
        setBookmarkPosts(tempPosts);
        
    }

    console.log("bookmarks ", bookmarkPosts)
    let bookmarkPost = bookmarkPosts?.map(post =>    
        <div key={post.postID} className="post-container">
          <div className="user-container">
            <img className="profile-picture" alt="user icon" src={myImg}></img>
            <span>
              <div className="user-name">
                {post.username}
              </div>
            <div className="content">
              <li key={post.id}>
                {post.textContent}
              </li>
            </div>
            </span>   
          </div>
          <Like user={user} post={post} /> 
          <BookmarkBtn 
          // key={post.postID}
          user={user} 
          post={post} 
          update={update} 
          setUpdate={setUpdate} 
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          />
        </div>
      )

    return(
        <div className="bm-main-container">
           <div> {bookmarkPost} </div>
        </div>
    )
}

export default Bookmarks;