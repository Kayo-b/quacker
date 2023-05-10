import React from 'react'
import { DocumentData, setDoc } from 'firebase/firestore';
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
    postId: number;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    user: UserProps;
}


const Post: React.FC<PostProps> = ({ update , newPost, posts, setUpdate, user }) => {
  
  const addLike = (postId) => {
    setDoc(postId, {likedByUsers: [user.uid]})
  }
          
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
        <button className="like-btn" onClick={e => addLike(post.id)}>Like</button>
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
        <button className="like-btn">Like</button>
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