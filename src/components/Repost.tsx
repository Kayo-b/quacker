import React from 'react'
import { useState, useEffect } from 'react';
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
import { db } from "../firebase";

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
    reposts?: Array<string>;
  }  
  
  type PostProps = {
    user: UserProps;
    post?: DocumentData;
    newPost: DocumentData[];
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    update: undefined | boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    name?: string;
    repost?: DocumentData[];
    setRepost?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    userMainFeed?: DocumentData[];
    setUserMainFeed: React.Dispatch<React.SetStateAction<DocumentData[]>>;
}



const Repost: React.FC<PostProps> = ({
    post, 
    user, 
    repost, 
    setRepost, 
    update, 
    setUpdate, 
    userMainFeed, 
    setUserMainFeed, 
    }) => {

  const [reposted, setReposted] = useState<boolean>(false);

  const hasUserReposted = async(postId: string) => {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      // const q = query(collection(db, 'users'), where("uid", "==",  user.uid));
      // const docs = await getDocs(q);
      // const userData = docs.docs[0].data();
      if(userDoc.exists()) {
          if(userDoc.data().reposts.includes(postId)) {
            setReposted(true);
          }
      }
  
  }
  
  const removeRepost = (postId: string) => {
      if(setRepost) { 
        setRepost(
          prevRepost => 
              prevRepost
              .filter(
                  post =>
                      post.postID !== postId))
                    }
      };

  const removeFromMainFeed = (postId: string) => {
    if(setUserMainFeed) { 
        setUserMainFeed(prevVal => prevVal.filter(value => value !== post?.postID))
    }
  }
      
  const addRepostPost = (newPost: DocumentData) => {
          
        if(setRepost) setRepost(
            prevRepost => [...prevRepost, newPost]) 

        if(setUserMainFeed) {
            setUserMainFeed(
            prevVal => [...prevVal, post?.postID]) 
        }
      }

      
      //See if there is a faster way to get the user's bookmarked posts, the query makes it take some time
    async function addRepost(postId: string) {
          // const q = query(collection(db, 'users'), where("uid", "==",  user.uid));
          // const docs = await getDocs(q);
          // const userRef = docs.docs[0].ref;
          // const userData = docs.docs[0].data();
          const userRef = doc(db, 'users', user.uid);
          const postRef = doc(db, 'posts', post?.postID);
          
        //   await setDoc(userRef, {
        //       mainFeed: arrayUnion(post?.postID)
        //   }, {merge: true})
          
          //const userDoc = await getDoc(userRef);
          //const userData = userDoc.data();
          if(!reposted) {
                setReposted(true);
                setDoc(userRef, {reposts: arrayUnion(postId)}, {merge: true});
                setDoc(userRef, {mainFeed: arrayUnion(postId)}, {merge: true});
                setDoc(postRef, {repostByUsers: arrayUnion(user.uid)}, {merge: true});
                setUpdate(true)
                if(post) addRepostPost(post);
                

          } else {
                setReposted(false);
                setDoc(userRef, {reposts: arrayRemove(postId)}, {merge: true});
                setDoc(userRef, {mainFeed: arrayRemove(postId)}, {merge: true});
                setDoc(postRef, {repostByUsers: arrayRemove(user.uid)}, {merge: true});
                setUpdate(false)
                removeRepost(post?.postID);
                removeFromMainFeed(post?.postID)
                console.log("Repost Remove Post From Object")
              }
              
          }
           
      
      // const addBookmarkBtn = (postId: string) => {
      //     addBookmark(postId)
      // }
  
      useEffect(() => {
        hasUserReposted(post?.postID);
        
      },[repost])
      
      return(
          <div className="bm-main-container">
              <button onClick={() => addRepost(post?.postID)}>
                  {reposted ? "Reposted" : "Repost"}</button>
          </div>
      )
}

export default Repost