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
    post?: DocumentData;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}


const Like: React.FC<PostProps> = ({user, post, setLoading}) => {

  const [liked, setLiked] = useState<boolean>(false)
  console.log(post,"post from liked>?>?>?>?>?>")

  // async function hasUserLikedPost(postId: string) {
  //   const postRef = doc(db, 'posts', postId);
  //   const postDoc = await getDoc(postRef);
  //   if(postDoc.exists()) {
  //     const postData = postDoc.data();
  //     if(postData.likedByUsers && postData.likedByUsers.includes(user.uid)) {
  //       setLiked(true)
  //     } 
  //   } else {
  //     setLiked(false)
  //   }
    
  // }
//  const hasUserLikedPost2 = () => {
//   console.log(post,"post!")
//   if(post?.likedByUsers.includes(user.uid)) {
//     return true;
//   } else {
//     return false;
//   }
//  }
  function likedPostCheck() {
    
    if(post?.likedByUsers.includes(user.uid)) {
            setLiked(true);
            console.log(true, post ,"liked????!!!")
          } else {
            setLiked(false);
            console.log(false,post,"liked????!!!")
          }
      //if(setLoading) setLoading(false);
    }

  const addLike = (postId: string) => {
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
    console.log(post?.likedByUsers, "liked by users +_+_+_+_+")
  }

  useEffect(() => {
    likedPostCheck()
  },[post])

  return (
      <button className="like-btn" onClick={e => addLike(post?.postID)}>
        {post?.likedByUsers.includes(user.uid) ? "Liked" : "Like"}</button> 
  )
}

export default Like;