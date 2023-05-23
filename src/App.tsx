import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Sidebar from './components/Sidebar';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Login from './components/Login'
import Register from './components/Register';
import Reset from './components/Reset';
import Dashboard from './components/Dashboard';
import logo from './logo.svg';
import './style/App.css';
import Bookmarks from './components/Bookmarks';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

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
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [bookmarkPosts, setBookmarkPosts] = useState<DocumentData[]>([])
  const [name, setName] = useState("");
  console.log(name)
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
        />}
        />
        <Route
        path="/bookmarks/"
        element={
        <Bookmarks 
          user={user as UserPropsOrigin} 
          posts={posts} 
          bookmarkPosts={bookmarkPosts} 
          setBookmarkPosts={setBookmarkPosts}
          />}
        />
        
      </Routes>
      </div>
      </div>
    </BrowserRouter>
    

  );
}

export default App;
