import React from 'react'
import { DocumentData } from 'firebase/firestore'


type PostProps = {
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    newPost: DocumentData[] ;
}
const Post: React.FC<PostProps> = ({newPost}) => {

    let neuPost = newPost.map(post =>
         <li>{post.textContent} <br></br> {post.userName}</li>
         )
    
  return (
    <li>{neuPost}</li>
        
    
  )
}

export default Post