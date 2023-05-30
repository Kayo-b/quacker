import React, { useEffect, useState } from 'react'
import { DocumentData, setDoc, collection, doc, arrayUnion, arrayRemove, query, where, getDoc } from 'firebase/firestore';
import { db } from "../firebase";


type UserProps = {
  authProvider?: string;
  email: string;
  name?: string;
  uid: string;
  bookmarks?: Array<string>;
}  

type PostProps = {
    user: UserProps;
    post: DocumentData;
}


const Like: React.FC<PostProps> = ({user, post}) => {

  const [liked, setLiked] = useState<boolean>(false)
 
  async function hasUserLikedPost(postId: string) {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if(postDoc.exists()) {
      const postData = postDoc.data();
      if(postData.likedByUsers && postData.likedByUsers.includes(user.uid)) {
        return true
      } 
    }
    return false
  }
 
  async function likedPostCheck(postID: string) {
    const postIsLiked = await hasUserLikedPost(postID)
    setLiked(postIsLiked);
  }

  const addLike = (postId: string) => {
    const postRef = doc(db, 'posts', postId)
    if(!liked) {
      setLiked(true);
      setDoc(postRef, {likedByUsers: arrayUnion(user.uid)}, {merge: true})
    } else {
      setLiked(false);
      setDoc(postRef, {likedByUsers: arrayRemove(user.uid)}, {merge: true})
    }
  }

  useEffect(() => {
    likedPostCheck(post.postID)
  },[])

  return (
   
      <button className="like-btn" onClick={e => addLike(post.postID)}>
        {liked ? "Liked": "Like"}</button> 
    
  )
}

export default Like;