import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
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
    
}

const FollowBtn: React.FC<PostProps> = ({
    user,
    post
}) => {
    const [followBtn, setFollowBtn] = React.useState<boolean>(false);

    const FollowUser = async(post: DocumentData | undefined) => {
        const userRef1 = doc(db, 'users', user.uid);
        const userRef2 = doc(db, 'users', post?.userID);
        const res = await getDoc(userRef1);
        const userData = res.data();
        if(userData){
          if(userData.following.includes(post?.userID)) {
              setDoc(userRef1, {following: arrayRemove(post?.userID)}, {merge: true});
              setDoc(userRef2, {followers: arrayRemove(user.uid)}, {merge: true});
              setFollowBtn(false);
            } else {
              setDoc(userRef1, {following: arrayUnion(post?.userID)}, {merge: true});
              setDoc(userRef2, {followers: arrayUnion(user.uid)}, {merge: true});
              setFollowBtn(true);
            }
        }
      }
    
    const checkFollow = async(post: DocumentData | undefined) => {
        const userRef1 = doc(db, 'users', user.uid);
        const userDoc1 = await getDoc(userRef1);
        if(userDoc1.exists()) {
            const userData1 = userDoc1.data();
            const following = userData1.following;
            if(following.includes(post?.userID)) {
              setFollowBtn(true);
            } else {
              setFollowBtn(false);
            }
        }
        
      }

      useEffect(() => {
        checkFollow(post);
      }, [])

    return(
        <button onClick={() => FollowUser(post)}>{followBtn === false ?
        "Follow" : "Unfollow"
        }</button>
      )
}

export default FollowBtn;