import React, { DOMElement, useEffect, useState } from 'react'
import { DocumentData, setDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
    post?: DocumentData;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Like: React.FC<PostProps> = ({user, post, setLoading}) => {

  const [liked, setLiked] = useState<boolean>(false)

  function likedPostCheck() {
    if(post?.likedByUsers.includes(user.uid)) {
            setLiked(true);
          } else {
            setLiked(false);
          }
    }

  const addLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();  
    const postRef = doc(db, 'posts', postId)
    if(!liked) {
      setLiked(true);
      post?.likedByUsers.push(user.uid)
      setDoc(postRef, {likedByUsers: arrayUnion(user.uid)}, {merge: true})
    } else {
      setLiked(false);
      let indexValue = post?.likedByUsers.indexOf(user.uid);
      post?.likedByUsers.splice(indexValue, 1)
      setDoc(postRef, {likedByUsers: arrayRemove(user.uid)}, {merge: true})
    }
  }

    useEffect(() => {
      likedPostCheck()
    },[])

    return (
        <button 
        className="like-btn" 
        onClick={e => addLike(post?.postID, e)}
        style={{ filter: post?.likedByUsers.includes(user.uid) ? 'grayscale(100%)' : 'grayscale(0%)' }}
        ></button> 
    )
  }

  export default Like;
