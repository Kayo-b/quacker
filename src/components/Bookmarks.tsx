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
  const [loading, setLoading] = React.useState(true);
  const [empty, setEmpty] = React.useState(false);
  const [bookmarksStatesCount, setBookmarksProfileStatesCount] = React.useState<number>(0);

  const waitForStates = () => {
    const bookmarksContainer = 
            document.querySelector(".bm-main-container") as HTMLElement;
    if(bookmarksStatesCount === 1) {
        if(bookmarksContainer) setTimeout(() => {
            bookmarksContainer.style.visibility = "visible";
            setLoading(false);
        }, 300)

    };
    //setBookmarksProfileStatesCount(0);
    if(user !== undefined) {
      if(user.bookmarks?.length === 0) {
        setLoading(false);
        setEmpty(true);
      }
    }
    
};
console.log(user, "USERERERRRRRRRRRRRRRRRRRRRRRr")
    const fetchBookmarks = async () => {
        console.log(bookmarkPosts,"KKKKKKKKKKKKKKKKKKKKkkkkk")
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
        console.log(tempPosts,"tempPostsSSS")
        setBookmarkUpdate(true);
    }
    
    let bookmarkPost = 
        // <Post 
        // name={name}
        // newPost={newPost}
        // setNewPost={setNewPost}
        // update={update}
        // setUpdate={setUpdate}
        // posts={posts}
        // user={user}
        // bookmarkPosts={bookmarkPosts} 
        // setBookmarkPosts={setBookmarkPosts}
        // repost={repost}
        // setRepost={setRepost}
        // userMainFeed={userMainFeed}
        // setUserMainFeed={setUserMainFeed}
        // bookmarkUpdate={bookmarkUpdate}
        // // setProfPost={setProfPost}
        // addToStatesCount={setBookmarksProfileStatesCount}
        // // setProfPostCheck={setProfPostCheck}
        // />
    
    bookmarkPosts?.map(post =>    
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
          addToStatesCount={setBookmarksProfileStatesCount}
          />
        </div>
      )

    useEffect(() => {
      waitForStates();
    },[bookmarksStatesCount])

    
    // useEffect(() => {
    //   fetchBookmarks();
    //   console.log("FETCHG")
    // },[])


      
    return(
        // <div className="bm-main-container">
        //    <div> {bookmarkPost} </div>
        // </div>
    
        <div>{loading ? "Loading..." : null} {empty ? "No bookmarked posts" : null}  
        <div className="bm-main-container" style={{visibility:"hidden"}}>
           <div> {bookmarkPost} </div>
        </div>
        </div>
    )
}

export default Bookmarks;