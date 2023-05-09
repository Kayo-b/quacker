import React from 'react'
import { DocumentData } from 'firebase/firestore';
import myImg from '../img/user-icon.png';

type PostProps = {
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[] ;
    posts: DocumentData[] ;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}


        
const Post: React.FC<PostProps> = ({ update ,newPost , posts, setUpdate }) => {

    let neuPost = newPost.map(post =>
      <li key={post.id}>{post.textContent} <br></br><i style={{fontSize: "12px"}}>
      by {post.userName}
      </i></li>
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