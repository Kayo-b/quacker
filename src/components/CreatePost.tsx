import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  
    addDoc, 
    collection, 
    serverTimestamp, 
    DocumentData, 
    setDoc, 
    doc, 
    arrayUnion,
    getDoc } from "firebase/firestore";
import { db } from "../firebase";


type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    imgUrl?: string;
}  

type PostProps = {
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    post?: DocumentData;
    newPost: DocumentData[];
    update: undefined | boolean;
    name?: string;
    user: UserProps;
    userImg?: string;
    userData?: DocumentData;
    closeModal?: () => void;
  };

const CreatePost: React.FC<PostProps> = ({setUpdate, update, name, user, newPost, setNewPost, post, userImg, userData, closeModal}) => {
const[text, setText] = useState("");
//onst[userImg, setUserImg] = useState("");
const [imgUrl, setImgUrl] = useState("");

// const getImg = async() => {
//     const userDocRef = doc(db, "users", user.uid);
//     const userDocSnap = await getDoc(userDocRef);
//     const userDocSnapData = userDocSnap.data();
//     if(userDocSnapData){
//         console.log("Snap")
//         console.log(imgUrl)
//         setImgUrl(userDocSnapData.imgUrl);
//     }

// }


const handleClick = async (text: String) => {
    if(text.length=== 0) return;

    //setUpdate(true);
    // handle form submission here.
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const userDocSnapData = userDocSnap.data();
    if(userDocSnapData){
        console.log("Snap")
        console.log(userDocSnapData.imgUrl)
        setImgUrl(userDocSnapData.imgUrl);
    }
    console.log("Snap3")
    console.log(userDocSnapData?.imgUrl)
    

    try {
        const docRef = await addDoc(collection(db, "posts"), {
            username: name,
            userID: user.uid,
            parentID: post ? post.postID : null,
            rootPostID: post ? post.postID : null,
            textContent: text,
            likedByUsers: [],
            repostByUsers: [],
            childComments: [],
            timestamp: serverTimestamp(),
            imgUrl: userDocSnapData?.imgUrl
        })

        const userDocRef = doc(db, "users", user.uid);
        if(!post) {
            await setDoc(userDocRef, {
                mainFeed: arrayUnion(docRef.id)
            }, {merge: true})
        }
        setUpdate(!update)
        //update === true ? setUpdate(false) : setUpdate(true)
        //setNewPost will add the new post into the newPost array so it 
        //can render the posts into the screen without needing to fetch them.
        setNewPost(prev => [{
            username: name,
            userID: user.uid,
            postID: docRef.id,
            parentID: post ? post.postID : null,
            rootPostID: post ? post.postID : docRef.id,
            textContent: text,
            likedByUsers: [],
            repostByUsers: [],
            childComments: [],
            timestamp: serverTimestamp(),
            imgUrl: userDocSnapData?.imgUrl
        }, ...prev]);
        //setDoc will add values into doRef after the docRef has been created.
        setDoc(docRef, {
            postID: docRef.id,  
            rootPostID: post ?
            post.rootPostID  : 
            docRef.id}, {
                merge: true})
       
    } catch(e) {
        console.error(e);
    }
    setText("");
    if(closeModal) closeModal();

  };
  console.log(userImg,"USERDATA22")
//   if(userData !== undefined) {
//     setUserImg(userData?.imgUrl)
//     console.log(userImg,"NEW USERDATA22")
//   }
//   useEffect(() => {
//     //getImg();
//     setUserImg(userData?.imgUrl)
//     // if(userData !== undefined) {
//     //     setUserImg(userData?.imgUrl)
//     //   }
//     console.log(userImg,"NEW USERDATA22")
//   },[])
 //!== userData?.imgUrl ? userImg : userData?.imgUrl
    return(
        <div className="post-wrapper-container">
        <div className="post-main-container"> 
        <img className="profile-picture" alt="user icon" src={userImg}></img> 
            <textarea 
                maxLength={150}
                placeholder="Say something..."
                value={text} 
                onChange={e => setText(e.target.value)}>
            </textarea>
            <input 
                type="button" 
                value="Post"
                className="post-btn" 
                onClick={() => handleClick(text)}>
            </input>
        </div>
        </div>
    )
}

export default CreatePost;