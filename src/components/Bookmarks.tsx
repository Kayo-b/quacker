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
    name: string;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[] ;
    posts: DocumentData[] ;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    user: UserProps;
    post?: DocumentData;
    bookmarkPosts?: DocumentData[];
    setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    isComment?: boolean | undefined;
    parentPost?: DocumentData;
    repost?: DocumentData[];
    setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    userMainFeed?: DocumentData[];
    setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
}


const Bookmarks: React.FC<BookmarksProps> = ({
  user, 
  update, 
  posts, 
  name, 
  bookmarkPosts, 
  newPost, 
  repost, 
  setRepost, 
  setNewPost, 
  setBookmarkPosts, 
  setUpdate,
  userMainFeed,
  setUserMainFeed
}) => {
  const [bookmarkUpdate, setBookmarkUpdate] = useState<boolean | undefined>(true) 


    const fetchBookmarks = async () => {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        let tempBookmarks: DocumentData[] = [];
        docs.forEach(doc => {
            const bookmarks = doc.data().bookmarks;
            tempBookmarks.push(...bookmarks)
        })

        let tempPosts: DocumentData[] = [];
        for (const bm of tempBookmarks) {
            const q = query(collection(db, "posts"), where("postID", "==", bm));
            const docs = await getDocs(q);
            docs.forEach(doc => {
                tempPosts.push(doc.data());
            });
        }
        setBookmarkPosts(tempPosts);
        setBookmarkUpdate(true);
    }
    
    let bookmarkPost = 
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
        repost={repost}
        setRepost={setRepost}
        userMainFeed={userMainFeed}
        setUserMainFeed={setUserMainFeed}
        bookmarkUpdate={bookmarkUpdate}
        // setProfPost={setProfPost}
        // addToStatesCount={setProfileStatesCount}
        // setProfPostCheck={setProfPostCheck}
        />
    
    // bookmarkPosts?.map(post =>    
    //     <div key={post.postID} className="post-container">
    //       <div className="user-container">
    //         <img className="profile-picture" alt="user icon" src={myImg}></img>
    //         <span>
    //           <div className="user-name">
    //             {post.username}
    //           </div>
    //         <div className="content">
    //           <li key={post.id}>
    //             {post.textContent}
    //           </li>
    //         </div>
    //         </span>   
    //       </div>
    //       <Like user={user} post={post} /> 
    //       <BookmarkBtn 
    //       // key={post.postID}
    //       user={user} 
    //       post={post} 
    //       update={update} 
    //       setUpdate={setUpdate} 
    //       bookmarkPosts={bookmarkPosts} 
    //       setBookmarkPosts={setBookmarkPosts}
    //       />
    //     </div>
    //   )

    useEffect(() => {
      fetchBookmarks();
    },[])
      
      
    return(
        <div className="bm-main-container">
           <div> {bookmarkPost} </div>
        </div>
    )
}

export default Bookmarks;