import React from 'react'
import { DocumentData } from 'firebase/firestore'


type PostProps = {
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[] ;
    posts: DocumentData[] ;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}
const Post: React.FC<PostProps> = ({ update ,newPost , posts, setUpdate }) => {

    let neuPost = newPost.map(post =>
         <li key={post.id}>{post.textContent} <br></br>{post.userName}</li>
         )
    let loadPosts = posts.map(post => 
      <li key={post.id}>{post.textContent} <br></br>{post.username}</li>
    )
    
  return (
    <div>
      <div>{ neuPost }</div>
      <div>{ loadPosts }</div>
    </div>
    
    
   
  )
  
}

export default Post