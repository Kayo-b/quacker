import React, { useEffect, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
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
    bioText: string;
    setBioText: React.Dispatch<React.SetStateAction<string>>;
    setDisplayedName: React.Dispatch<React.SetStateAction<string>>;
  };


const EditProfile: React.FC<EditProfileProps> = ({update, setUpdate,bioText, setBioText, post, setDisplayedName, user}) => {

    const [imageUpload, setImageUpload] = React.useState<File | null>(null)
    const [bioTempText, setTempBioText] = React.useState<String>('');
    const [nameTempText, setNameTempText] = React.useState<String>('');

    const handleClick = () => {
        if(imageUpload === null) return null;
        const imageRef =  ref(storage, `/images/${user.uid}/profile_image/profile_img.png`);
        uploadBytes(imageRef, imageUpload)
        // .then(() => {
        //     alert("img uploaded");
        //     getDownloadURL(imageRef)
        //     .then((url) => {
        //         setDoc(doc(db, "users", user.uid), {imgUrl: url}, {merge: true})
        //     })
        // })
    }

    const handleClick2 = () => {
        if(imageUpload === null) return null;
        const imageRef =  ref(storage, `/images/${user.uid}/background_image/background_img`);
        uploadBytes(imageRef, imageUpload).then(() => {
            alert("img uploaded");
        })
    }

    const handleClick3 = async() => {
        const userRef2 = doc(db, 'users', post?.userID);
        await setDoc(userRef2, {displayedName: nameTempText}, {merge: true});
        setDisplayedName(nameTempText as string);
        
    }



    const handleClick4 = async() => {
        const userRef2 = doc(db, 'users', post?.userID);
        await setDoc(userRef2, {bioText: bioTempText}, {merge: true});
        setBioText(bioTempText as string);
        
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
            <button onClick={handleClick}>Upload Profile Picture</button>

            <input 
            type="file"
            onChange={(e) => 
                e.target.files !== null ?
                setImageUpload((e.target.files[0])) :
                null
            }
            >
            </input>
            <button onClick={handleClick2}>Upload Background Image</button>

            <input 
            type="text" 
            onChange={(e) => setNameTempText(e.target.value)}
            ></input>
            <button type="submit" onClick={handleClick3}>Update Name</button>
            

            <input 
            type="text" 
            onChange={(e) => setTempBioText(e.target.value)}
            ></input>
            <button type="submit" onClick={handleClick4}>Update Bio</button>
            
        </div>
    )}

export default EditProfile;