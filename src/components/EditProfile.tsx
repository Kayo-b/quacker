import React, { useEffect, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData, writeBatch, doc, setDoc , getDoc, collection, where, query, getDocs, QuerySnapshot} from "firebase/firestore";
import { IoIosAddCircleOutline } from "react-icons/io";
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
    posts: DocumentData[];
    newPost: DocumentData[];
    update: undefined | boolean;
    name?: string;
    user: UserProps;
    bioText: string;
    setBioText: React.Dispatch<React.SetStateAction<string>>;
    setDisplayedName: React.Dispatch<React.SetStateAction<string>>;
  };


const EditProfile: React.FC<EditProfileProps> = ({update, posts, setUpdate,bioText, setBioText, post, setDisplayedName, user}) => {

    const [profImageUpload, setProfImageUpload] = React.useState<File | null>(null)
    const [backgroundImageUpload, setBackgroundImageUpload] = React.useState<File | null>(null)
    const [bioTempText, setTempBioText] = React.useState<String>('');
    const [nameTempText, setNameTempText] = React.useState<String>('');

    const handleClick = () => {
        let id = document.getElementById("label-id-prof-pic-upload")
        let imgUrlFromEle = (id as HTMLImageElement).src
        if(profImageUpload === null) return null;
        const imageRef =  ref(storage, `/images/${user.uid}/profile_image/profile_img.png`);
        uploadBytes(imageRef, profImageUpload)
        .then(() => {

            alert("img uploaded");
            getDownloadURL(imageRef)
            .then((url) => {
                //updates all posts from user with the new img
                setDoc(doc(db, "users", user.uid), {imgUrl: url}, {merge: true})
                const q = query(collection(db, "posts"), where("userID", "==", user.uid));
                const batch = writeBatch(db);
                getDocs(q).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {

                        batch.update(doc.ref, {imgUrl: url});
                    });
                    setUpdate(!update)
                    return batch.commit();
                });
            })
        })
    }

    const handleClick2 = () => {
        if(backgroundImageUpload === null) return null;
        const imageRef =  ref(storage, `/images/${user.uid}/background_image/background_img`);
        uploadBytes(imageRef, backgroundImageUpload).then(() => {
            alert("img uploaded");
            getDownloadURL(imageRef)
            .then((url) => {
                //updates all posts from user with the new img
                setDoc(doc(db, "users", user.uid), {bkgImgUrl: url}, {merge: true})
                const q = query(collection(db, "posts"), where("userID", "==", user.uid));
                const batch = writeBatch(db);
                getDocs(q).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {

                        batch.update(doc.ref, {bkgImgUrl: url});
                    });
                    setUpdate(!update)
                    return batch.commit();
                });
            })
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

    const handleSave = () => { 
        handleClick();
        handleClick2();
        handleClick3();
        handleClick4();
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files !== null) {
            const inputElement = e.target;
            const previousSiblingElement = inputElement.previousElementSibling;
            if (previousSiblingElement !== null) {
                previousSiblingElement.innerHTML = e.target.files[0].name;
            }
        }
    }
    return(
            <div className="edit-profile-main-container">
                <div className="edit-profile-title"><span><h3>Edit Profile</h3></span></div>

                <div className="img-upload-wrapper-container">
                    <div className="upload-profile-pic-container">
                    <span className="upload-img-title">Profile Image</span>
                        <label htmlFor="label-id-prof-pic-upload" className="upload-profile-pic-file-input" id="myimgprofile">
                            Add Image
                        </label>
                        <input 
                            id="label-id-prof-pic-upload"
                            type="file"
                            onChange={(e) => 
                                e.target.files !== null ?
                                (setProfImageUpload(e.target.files[0]), handleOnChange(e)) :
                                null
                            }
                        ></input>
                    </div>
                    <div className="upload-background-img-container">   
                        <span className="upload-img-title">Background Image</span>
                            <label htmlFor="label-id-background-img-upload" className="upload-background-img-file-input">
                                Add Image 
                            </label>
                            <input 
                                id="label-id-background-img-upload"
                                type="file"
                                onChange={(e) => 
                                    e.target.files !== null ?
                                    (setBackgroundImageUpload(e.target.files[0]), handleOnChange(e)) :
                                    null
                                }
                            ></input>
                    </div>
                </div>
                <div className="update-name-container">
                    <label htmlFor="label-id-update-name" className="update-name-label">
                        Name
                    </label>
                    <input 
                        id="label-id-update-name"
                        type="text" 
                        onChange={(e) => setNameTempText(e.target.value)}
                    ></input>
                </div>
                <div className="update-bio-container">
                    <label htmlFor="label-id-update-bio" className="update-bio-label">
                        Bio
                    </label>
                    <textarea
                        id="label-id-update-bio"
                        maxLength={100}
                        onChange={(e) => setTempBioText(e.target.value)}
                    ></textarea>
                </div>
                <button onClick={handleSave} className="save-btn">Save</button>
            </div>
    )}

export default EditProfile;