import React, { useEffect, useState } from 'react'
import { ref, uploadBytes } from 'firebase/storage'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData, arrayUnion, arrayRemove, doc, setDoc , getDoc, collection, where, query, getDocs} from "firebase/firestore"
import { db, storage } from "../firebase";
import Post from '../components/Post';
import myImg from '../img/user-icon.png';

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
}  

type EditProfileProps = {
    setUpdate: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    setNewPost: React.Dispatch<React.SetStateAction<DocumentData[]>>;
    post?: DocumentData;
    newPost: DocumentData[];
    update: undefined | boolean;
    name?: string;
    user: UserProps;
  };


const EditProfile: React.FC<EditProfileProps> = ({name}) => {

    const [imageUpload, setImageUpload] = React.useState<File | null>(null)

    const handleClick = () => {
        console.log("CLICK")
        if(imageUpload === null) return null;
        const imageRef =  ref(storage, `profile_images/${imageUpload.name + Math.floor(Math.random() * 999999999)}`);
        uploadBytes(imageRef, imageUpload).then(() => {
            alert("img uploaded")
        })
    }


    return(
        <div className="edit-profile-main-container">
            <h3>Edit Profile</h3>
            <input 
            type="file"
            onChange={(e) => 
                e.target.files !== null ?
                setImageUpload((e.target.files[0])) :
                null
            }
            >
            </input>
            <button onClick={handleClick}>Upload Picture</button>
        </div>
    )}

export default EditProfile;