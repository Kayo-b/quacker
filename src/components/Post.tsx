import React, { useEffect } from 'react'
import { DocumentData, setDoc, collection, doc, arrayUnion, arrayRemove, query, where, getDoc } from 'firebase/firestore';
import { db } from "../firebase";
import Like from './Like'
import myImg from '../img/user-icon.png';


type UserProps = {
  authProvider?: string;
  email: string;
  name?: string;
  uid: string;
}  

type PostProps = {
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[] ;
    posts: DocumentData[] ;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    user: UserProps;
}


const Post: React.FC<PostProps> = ({ update , newPost, posts, setUpdate, user }) => {
  


    // useEffect(() => {
      
    //   hasUserLikedPost(post);
    // })
    let neuPost = newPost.map(post =>    
      <div className="post-container">
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
        <Like user={user} post={post}/> 
      </div>
      
    )
    let loadPosts = posts.map(post => 
      <div className="post-container">
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
        <Like user={user} post={post}/> 
      </div>
    )
    
  return (
    <div>
      <div>{ neuPost }</div>
      <div>{ loadPosts }</div>
    </div>
  )
  
}

export default Post