import React, {useEffect, useState, createContext} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  getDoc, 
  collection, 
  serverTimestamp, 
  SnapshotOptions, 
  DocumentData, 
  orderBy, 
  setDoc, 
  doc,
  where,
  query,
  getDocs
 } 
  from "firebase/firestore";
import { db } from "./firebase";
import Sidebar from './components/Sidebar';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Login from './components/Login'
import Register from './components/Register';
import Reset from './components/Reset';
import PostPage from './components/PostPage';
import ProfilePage from './components/ProfilePage';
import Feed from './components/Feed';
import Dashboard from './components/Dashboard';
import logo from './logo.svg';
import './style/App.css';
import Bookmarks from './components/Bookmarks';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import BookmarkBtn from './components/BookmarkBtn';

type UserPropsOrigin = {
  authProvider?: string;
  email: string;
  name?: string;
  uid: string;
  bookmarks?: Array<string>;

}  
interface User {
  authProvider?: string;
  email: string;
  name?: string;
  uid: string;
  bookmarks?: Array<string>;
}

// type AppProps = { 
//   user: UserPropsOrigin ;
//   loading: boolean;
//   error: string;
//   name: string;
//   setName: React.Dispatch<React.SetStateAction<string>>;
// }

   
export const UserContext = createContext<User | null | undefined>(undefined);

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userMainFeed, setUserMainFeed] = useState<DocumentData[]>([]);
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [bookmarkPosts, setBookmarkPosts] = useState<DocumentData[]>([])
  const [repost, setRepost] = useState<DocumentData[]>([])
  const [update, setUpdate] = useState<boolean | undefined>()
  const [newPost, setNewPost] = useState<DocumentData[]>([])
  const [name, setName] = useState("");
  const [userID, setUserID] = useState("");
  const [postPageStatesCount, setPostFeedStatesCount] = React.useState<number>(0)
  const [profPost, setProfPost] = React.useState<boolean>(true);
  const [profPostCheck, setProfPostCheck] = React.useState<number>(0);
  const [updateFollow, setUpdateFollow] = React.useState<boolean>(false);
  

  // const [favorited, setFavorited] = useState<boolean>(false);

//  useEffect(() => {
//   getUserMainFeed();
//   console.log(userMainFeed)
//  }, [update])


//   let getUserMainFeed = async () => {
//     if(user && user.uid) {
//       const userDocRef = doc(db, "users", user?.uid);
//       const userDocSnap = await getDoc(userDocRef);
//       if(userDocSnap.exists()){
//         const userDocSnapData = userDocSnap.data();
//         setUserMainFeed(userDocSnapData.mainFeed);
//       } 
//     } else {
//       console.log("no user")
//     }

  
 
//  }

const fetchBookmarks = async () => {
 
  const q = query(collection(db, "users"), where("uid", "==", user?.uid));
  const docs = await getDocs(q);
 
  let tempBookmarks: DocumentData[] = [];
  docs.forEach(doc => {
    console.log(doc.data(), "DOC!S")
      const bookmarks = doc.data().bookmarks;
      tempBookmarks.push(...bookmarks)
  })
  console.log(docs,"docs")
  let tempPosts: DocumentData[] = [];
  for (const bm of tempBookmarks) {
      const q = query(collection(db, "posts"), where("postID", "==", bm));
      const docs = await getDocs(q);
      docs.forEach(doc => {
          tempPosts.push(doc.data());
      });
  }
  setBookmarkPosts(tempPosts);
  console.log("app component 22")
  console.log(tempPosts,"tempPosstsSSS")
  //setBookmarkUpdate(true);
}



useEffect(() => {
  fetchBookmarks();
  console.log("app componet", user )
},[user])

  return (
    <UserContext.Provider value={user as UserPropsOrigin}> {
    <BrowserRouter>
     <div className="App">
      <div className="sidebar">
      <Sidebar 
      name={name} 
      userID={userID}
      setUserID={setUserID}
      user={user as UserPropsOrigin} 
      loading={loading} 
      error={error ? error.toString() : ""} 
      setName={setName}/>
      </div>
      <div className="center-container">
      
      <Routes>
        <Route 
        path="/" 
        element={<Login/>}
        />   
        <Route 
        path="/register" 
        element={<Register/>}
        />
        <Route 
        path="/reset" 
        element={<Reset/>}
        />        
        <Route
        path="/homepage/"
        element={
        <Homepage 
        name={name} 
        user={user as UserPropsOrigin} 
        posts={posts} 
        setPosts={setPosts}
        update={update}
        setUpdate={setUpdate}
        bookmarkPosts={bookmarkPosts} 
        setBookmarkPosts={setBookmarkPosts}
        setNewPost={setNewPost}
        newPost={newPost}
        repost={repost}
        setRepost={setRepost}
        userMainFeed={userMainFeed}
        setUserMainFeed={setUserMainFeed}
        updateFollow={updateFollow}
        setUpdateFollow={setUpdateFollow}
        />}
        />
        <Route
        path="/bookmarks/"
        element={
        <Bookmarks 
        name={name} 
        user={user as UserPropsOrigin} 
        posts={posts} 
        setPosts={setPosts}
        update={update}
        setUpdate={setUpdate}
        bookmarkPosts={bookmarkPosts} 
        setBookmarkPosts={setBookmarkPosts}
        setNewPost={setNewPost}
        newPost={newPost}
        repost={repost}
        setRepost={setRepost}
        userMainFeed={userMainFeed}
        setUserMainFeed={setUserMainFeed}
        postPageStatesCount={postPageStatesCount}
        addToStatesCount={setPostFeedStatesCount}
        updateFollow={updateFollow}
        setUpdateFollow={setUpdateFollow}
        />}
        />
        <Route
        path="/post/:postId"
        element={
        <PostPage
          name={name}
          user={user as UserPropsOrigin}
          update={update} 
          setUpdate={setUpdate}
          posts={posts} 
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          setNewPost={setNewPost}
          newPost={newPost}
          repost={repost}
          setRepost={setRepost}
          userMainFeed={userMainFeed}
          setUserMainFeed={setUserMainFeed}
          setPosts={setPosts}
          addToStatesCount={setPostFeedStatesCount}
          updateFollow={updateFollow}
          setUpdateFollow={setUpdateFollow}
          />}
        />
        <Route
        path="/profile/:userId"
        element={
        <ProfilePage 
        name={name}
        user={user as UserPropsOrigin}
        update={update} 
        setUpdate={setUpdate}
        posts={posts} 
        bookmarkPosts={bookmarkPosts} 
        setBookmarkPosts={setBookmarkPosts}
        setNewPost={setNewPost}
        newPost={newPost}
        repost={repost}
        setRepost={setRepost}
        userMainFeed={userMainFeed}
        setUserMainFeed={setUserMainFeed}
        profPost={profPost}
        setProfPost={setProfPost}
        profPostCheck={profPostCheck}
        setProfPostCheck={setProfPostCheck}
        
        />}
        />
        <Route
        path="/search/:search"
        element={
        <Feed 
         setUpdate={setUpdate} 
         update={update} 
         newPost={newPost} 
         setNewPost={setNewPost} 
         user={user as UserPropsOrigin} 
         posts={posts}
         setPosts={setPosts}
         bookmarkPosts={bookmarkPosts} 
         setBookmarkPosts={setBookmarkPosts}
         name={name}
         repost={repost}
         setRepost={setRepost}
         userMainFeed={userMainFeed}
         setUserMainFeed={setUserMainFeed}
         updateFollow={updateFollow}
         setUpdateFollow={setUpdateFollow}
        />
        }
        />
      </Routes>
      </div>
      <div className="right-container">
      <Navbar/>
        {/* <Routes>
      <Route
        path="/homepage/"
        element={
        <Navbar/>
      }/>
      </Routes> */}
      </div>
      </div>
      
    </BrowserRouter>
    } </UserContext.Provider>
  );
}

export default App;
