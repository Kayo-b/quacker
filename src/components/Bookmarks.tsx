import React, { useState, useEffect, useRef, MouseEvent, useContext} from "react";
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
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
    addDoc,
    deleteDoc,
    arrayRemove
} 
from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import myImg from '../img/user-icon.png';
import Like from './Like'
import BookmarkBtn from './BookmarkBtn';
import Comment from './Comment';
import Repost from './Repost';
import FollowBtn from "./FollowBtn";
import '../style/App.css';

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
    setPosts?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    bookmarkPosts?: DocumentData[];
    setBookmarkPosts: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    isComment?: boolean | undefined;
    parentPost?: DocumentData;
    repost?: DocumentData[];
    setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    userMainFeed?: DocumentData[];
    setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    postPageStatesCount: number;
    addToStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    profPost?: boolean;
    setProfPost?: React.Dispatch<React.SetStateAction<boolean>>;
    updateFollow?: boolean;
    setUpdateFollow?:React.Dispatch<React.SetStateAction<boolean>>;
    userData?: DocumentData;
    setPostFeedStatesCount?: React.Dispatch<React.SetStateAction<number>>;
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
  setUserMainFeed,
  addToStatesCount,
  setPosts,
  profPost,
  setProfPost,
  updateFollow,
  setUpdateFollow,
  setPostFeedStatesCount,
  userData
}) => {
  const [bookmarkUpdate, setBookmarkUpdate] = useState<boolean | undefined>(true) 
  const [loading, setLoading] = React.useState(true);
  const [empty, setEmpty] = React.useState(false);
  const [bookmarksStatesCount, setBookmarksProfileStatesCount] = React.useState<number>(0);
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const dotsSvg = <svg viewBox="0 0 24 24" className="threeDotsSvg" aria-hidden="true"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>

  const waitForStates = () => {
    const bookmarksContainer = 
            document.querySelector(".bm-main-container") as HTMLElement;
    if(bookmarksStatesCount === 1) {
        if(bookmarksContainer) setTimeout(() => {
            bookmarksContainer.style.visibility = "visible";
            setLoading(false);
        }, 300)
    };
      if(bookmarkPosts?.length === 0) {
        
        setLoading(false);
        setEmpty(true);
      }
};
  //Getting single post object values and passing them to the postPage URL
  const RedirectToPostPage = (post: DocumentData) => {
    if(addToStatesCount) addToStatesCount(0);
    if(setLoading) setLoading(true);
    navigate(`/post/${post.postID}`, {state: {post}})
    const postPageContainers = document.querySelectorAll(".post-page-container");
    postPageContainers.forEach((container: Element) => {
    (container.parentElement?.parentElement as HTMLElement).style.visibility = "hidden";
  });
};

  const RedirectToProfilePage = (post: DocumentData | undefined) => {
    navigate(`/profile/${post?.username}`, {state: {post}});
    update === true ? setUpdate(false) : setUpdate(true);
}

const removeBookmarkPost = (postId: string) => {
  if(setBookmarkPosts) setBookmarkPosts(
      prevBookmarkPosts => 
          prevBookmarkPosts
          .filter(
              post =>
                  post.postID !== postId)) 
  };


const RemovePost = (post: DocumentData | undefined) => {

  setUserMainFeed(prevVal => 
    prevVal.filter(value => value !== post?.postID));

  setNewPost(prevVal => 
    prevVal.filter(value => value.postID !== post?.postID));

  if(setPosts) {
    setPosts(prevVal => 
      prevVal.filter(value => value.postID !== post?.postID));
    }

  var removePostFromDB = async () =>  {
    const userRef = doc(db, 'users', user.uid);
    await deleteDoc(doc(db, "posts", post?.postID));
    await setDoc(userRef, {mainFeed: arrayRemove(post?.postID)}, {merge: true});
    console.log(posts)
  }
  //update === true ? setUpdate(false) : setUpdate(true);
  removePostFromDB();
  removeBookmarkPost(post?.postID);
  //update === true ? setUpdate(false) : setUpdate(true)
}

// const handleClick = (event: MouseEvent) => {
//   const targetElement = event.target as HTMLElement;
//   const nextElement = targetElement.nextElementSibling as HTMLElement;
//   if(event.target && nextElement.style.display === "none") {
//     nextElement.style.display = "block";
//   } else {
//     nextElement.style.display = "none";
//   }
// };
const handleClick = (event: MouseEvent) => {
  let targetElement = event.target as HTMLElement;
  targetElement = targetElement.parentElement as HTMLElement;
  
  const nextElement = targetElement.nextElementSibling as HTMLElement;
  const nextNextEle = nextElement.children[0] as HTMLElement;
  if(event.target && nextElement.style.display === "none") {
    nextElement.style.display = "flex";
    nextNextEle.style.display = "flex";
  } else {
    nextElement.style.display = "none";
    nextElement.style.display = "none";
  }
};

    // const fetchBookmarks = async () => {
    //     console.log(bookmarkPosts,"KKKKKKKKKKKKKKKKKKKKkkkkk")
    //     const q = query(collection(db, "users"), where("uid", "==", user.uid));
    //     const docs = await getDocs(q);
    //     let tempBookmarks: DocumentData[] = [];
    //     docs.forEach(doc => {
    //         const bookmarks = doc.data().bookmarks;
    //         tempBookmarks.push(...bookmarks)
    //     })

    //     let tempPosts: DocumentData[] = [];
    //     for (const bm of tempBookmarks) {
    //         const q = query(collection(db, "posts"), where("postID", "==", bm));
    //         const docs = await getDocs(q);
    //         docs.forEach(doc => {
    //             tempPosts.push(doc.data());
    //         });
    //     }
    //     setBookmarkPosts(tempPosts);
    //     console.log(tempPosts,"tempPostsSSS")
    //     //setBookmarkUpdate(true);
    // }
    
    let bookmarkPost = 
    bookmarkPosts?.map(post =>   
      
      <div className="post-container" key={post.postID} onClick={() => RedirectToPostPage(post)}>
        <div className="option-btn-container">
        <button className="options-btn"  onClick={(e) => handleClick(e) }>{dotsSvg}</button>
        <div style={{display: "none"}} className="btnSubcontainer">
            <div id="options" style={{display: "flex"}}>
            {
              userCtx?.uid === post?.userID ?
              <button className="deleteBtn" onClick={() => RemovePost(post)}>Delete</button> :
              <div><FollowBtn post={post} user={userCtx as UserProps} setUpdateFollow={setUpdateFollow} updateFollow={updateFollow} /></div>
            }
            </div>
          </div>
        </div>
      <div className="user-container">
        <img className="profile-picture" alt="user icon" src={post?.imgUrl}></img>
        <span>
          <div className="user-name" onClick={() => RedirectToProfilePage(post)}>
            {post.username}
          </div>
        <div className="content" onClick={() => RedirectToPostPage(post)}>
            <li key={post.id} className="text-content-field">
              {post.textContent}
            </li>
        </div>
        </span>
      </div>
    <div className="main-btn-container">
    <Like 
        user={userCtx as UserProps} 
        post={post}
        /> 
        <BookmarkBtn 
          user={userCtx as UserProps} 
          post={post} 
          update={update} 
          setUpdate={setUpdate}
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          userData={userData}
        />
        <Comment 
         user={userCtx as UserProps}
         post={post}
         setUpdate={setUpdate}
         setNewPost={setNewPost}
         newPost={newPost}
         update={update}
         name={name}
        />
        <Repost 
        user={userCtx as UserProps}
        post={post}
        setUpdate={setUpdate}
        setNewPost={setNewPost}
        newPost={newPost}
        update={update}
        name={name}
        repost={repost}
        setRepost={setRepost}
        userMainFeed={userMainFeed}
        setUserMainFeed={setUserMainFeed}
        profPost={profPost}
        setProfPost={setProfPost}
        addToStatesCount={addToStatesCount}
        setBookmarksProfileStatesCount={setBookmarksProfileStatesCount}
        />
    </div>
   
    </div>
        // <div key={post.postID} className="post-container">
        //   <div className="user-container">
        //     <img className="profile-picture" alt="user icon" src={myImg}></img>
        //     <span>
        //       <div className="user-name">
        //         {post.username}
        //       </div>
        //     <div className="content">
        //       <li key={post.id}>
        //         {post.textContent}
        //       </li>
        //     </div>
        //     </span>   
        //   </div>
        //   <Like user={user} post={post} /> 
        //   <BookmarkBtn 
        //   // key={post.postID}
        //   user={user} 
        //   post={post} 
        //   update={update} 
        //   setUpdate={setUpdate} 
        //   bookmarkPosts={bookmarkPosts} 
        //   setBookmarkPosts={setBookmarkPosts}
        //   addToStatesCount={setBookmarksProfileStatesCount}
        //   />
        // </div>
      )

    useEffect(() => {
      waitForStates();
    },[bookmarksStatesCount])

    
    // useEffect(() => {
    //   fetchBookmarks();
    //   console.log("FETCHG")
    // },[])

    const loadingSvg = 
    <svg xmlns="http://www.w3.org/2000/svg" width="94px" height="94px" viewBox="0 0 100 150" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#6a6a6a" stroke-width="2" r="25" stroke-dasharray="141.37166941154067 49.12388980384689">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.7633587786259541s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
        </circle>
    </svg>
      
    return(
        // <div className="bm-main-container">
        //    <div> {bookmarkPost} </div>
        // </div>
    
        <div>
           <div className="loading-element-container" style={{border: loading ? "1px solid rgba(245, 245, 245, 0.307)" : "none"}}>
                <div>{loading ? loadingSvg : null} {empty ? "No bookmarked posts" : null}</div>
            </div>
        <div className="bm-main-container" style={{visibility:"hidden"}}>
           <div> {bookmarkPost} </div>
        </div>
        </div>
    )
}

export default Bookmarks;