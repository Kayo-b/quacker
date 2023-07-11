import React, {useEffect, useState} from 'react';
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

// type AppProps = { 
//   user: UserPropsOrigin ;
//   loading: boolean;
//   error: string;
//   name: string;
//   setName: React.Dispatch<React.SetStateAction<string>>;
// }



const App = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userMainFeed, setUserMainFeed] = useState<DocumentData[]>([]);
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [bookmarkPosts, setBookmarkPosts] = useState<DocumentData[]>([])
  const [repost, setRepost] = useState<DocumentData[]>([])
  const [update, setUpdate] = useState<boolean | undefined>()
  const [newPost, setNewPost] = useState<DocumentData[]>([])
  const [name, setName] = useState("");
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
  //setBookmarkUpdate(true);
}

useEffect(() => {
  fetchBookmarks();
},[])

  return (
   
    <BrowserRouter>
     <div className="App">
      <div className="sidebar">
      <Sidebar 
      name={name} 
      user={user as UserPropsOrigin} 
      loading={loading} 
      error={error ? error.toString() : ""} 
      setName={setName}/>
      </div>
      
      <div className="center-container">
      <Navbar />
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
        />}
        />
        <Route
        path="/bookmarks/"
        element={
        <Bookmarks 
        name={name} 
        user={user as UserPropsOrigin} 
        posts={posts} 
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
        />}
        />
      </Routes>
      </div>
      </div>
    </BrowserRouter>
    

  );
}

export default App;
