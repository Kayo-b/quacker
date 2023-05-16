import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { DocumentData, arrayUnion, doc, setDoc, collection, where, query, getDocs} from "firebase/firestore"
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



const BookmarkBtn: React.FC<PostProps> = ({user, post}) => {

    const hasUserBookmarkedPost = () => {
        const userRef = doc(db, 'users', user.uid);
        
    }

    const addBookmark = async(postId: string) => {
        const q = query(collection(db, 'users'), where("uid", "==",  user.uid));
        const docs = await getDocs(q);
        const userRef = docs.docs[0].ref;
        setDoc(userRef, {bookmarks: arrayUnion(postId)}, {merge: true})
    }

    return(
        <div className="bm-main-container">
            <button onClick={() => addBookmark(post.postID)}>Favorite</button>
        </div>
    )
}

export default BookmarkBtn;

