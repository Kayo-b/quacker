import React, { useState, useEffect, useContext} from "react";
import { UserContext } from '../App';
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
import { db } from "../firebase";
import { BsStar } from 'react-icons/bs'

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
    update: undefined | boolean;
    bookmarkPosts?: DocumentData[];
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    setBookmarkPosts?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    bookmarkUpdate?: undefined | boolean;
    setBookmarkUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
    addToStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    userData?: DocumentData;
    userDoc?: DocumentData;
    
}

const BookmarkBtn: React.FC<PostProps> = ({
    user,
    post, 
    setUpdate, 
    update, 
    bookmarkPosts, 
    setBookmarkPosts,
    bookmarkUpdate,
    setBookmarkUpdate,
    addToStatesCount,
    userData,

}) => {

const [favorited, setFavorited] = useState<boolean>(false);

const hasUserBookmarkedPost = async(postId: string) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if(userDoc.exists()) {
        if(userDoc.data().bookmarks.includes(postId)) {
            setFavorited(true);
        }
    }
    if(addToStatesCount) addToStatesCount(1)
}

const removeBookmarkPost = (postId: string) => {
    if(setBookmarkPosts) setBookmarkPosts(
        prevBookmarkPosts => 
            prevBookmarkPosts
            .filter(
                post =>
                    post.postID !== postId)) 
    };

const addBookmarkPost = (newPost: DocumentData) => {
        if(setBookmarkPosts) setBookmarkPosts(
            prevBookmarkPosts => [...prevBookmarkPosts, newPost]) 
            
    }
//See if there is a faster way to get the user's bookmarked posts, the query makes it take some time
const addBookmark = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const userRef = doc(db, 'users', user.uid);
    
    if(!favorited) {
            setFavorited(true);
            setDoc(userRef, {bookmarks: arrayUnion(postId)}, {merge: true})
            setUpdate(true);
            if(post) addBookmarkPost(post); 
            
    } else {
            setFavorited(false);
            setDoc(userRef, {bookmarks: arrayRemove(postId)}, {merge: true});
            setUpdate(false);
            removeBookmarkPost(post?.postID);
        }
    }

    useEffect(() => {
        hasUserBookmarkedPost(post?.postID);
    },[bookmarkPosts])
    return(
        <div className="bm-main-container" data-testid="bookmark-button-container">
            <BsStar 
            className="star-icon-post" 
            onClick={(e) => addBookmark(post?.postID, e)} 
            style={{color: favorited ? "yellow" : undefined}}
            data-testid="bookmark-button"
            />
        </div>
    )
}

export default BookmarkBtn;

