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
    update: undefined | boolean;
    bookmarkPosts?: DocumentData[];
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    setBookmarkPosts?: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    bookmarkUpdate?: undefined | boolean;
    setBookmarkUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
    addToStatesCount?: React.Dispatch<React.SetStateAction<number>>;
    
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
    addToStatesCount

}) => {

const [favorited, setFavorited] = useState<boolean>(false);

// const hasUserBookmarkedPost2 = (postId: string) => {
//     if(post !== undefined ) {
//         if(bookmarkPosts?.includes(post)) {
//         setFavorited(true);
//     };
//     }

//     hasUserBookmarkedPost(postId)
// }

const hasUserBookmarkedPost = async(postId: string) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    // const q = query(collection(db, 'users'), where("uid", "==",  user.uid));
    // const docs = await getDocs(q);
    // const userData = docs.docs[0].data();
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
const addBookmark = async (postId: string) => {
    // const q = query(collection(db, 'users'), where("uid", "==",  user.uid));
    // const docs = await getDocs(q);
    // const userRef = docs.docs[0].ref;
    // const userData = docs.docs[0].data();
    const userRef = doc(db, 'users', user.uid);
    
    //const userDoc = await getDoc(userRef);
    //const userData = userDoc.data();
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
        //update === false ? setUpdate(true) : setUpdate(false);
        
    }
// const addBookmarkBtn = (postId: string) => {
//     addBookmark(postId)
// }

    useEffect(() => {
        // hasUserBookmarkedPost2(post?.postID);
        hasUserBookmarkedPost(post?.postID);
        
    },[bookmarkPosts])

    return(
        <div className="bm-main-container">
            <button onClick={() => addBookmark(post?.postID)}>
                {favorited ? "Unfavorite" : "Favorite"}</button>
        </div>
    )
}

export default BookmarkBtn;

