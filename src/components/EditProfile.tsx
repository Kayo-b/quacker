import React, { useEffect, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useParams, useLocation } from 'react-router-dom';
import { DocumentData, writeBatch, doc, setDoc , getDoc, collection, where, query, getDocs, QuerySnapshot} from "firebase/firestore"
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

    const [imageUpload, setImageUpload] = React.useState<File | null>(null)
    const [bioTempText, setTempBioText] = React.useState<String>('');
    const [nameTempText, setNameTempText] = React.useState<String>('');

    const handleClick = () => {
        let id = document.getElementById("myimgprofile")
        let imgUrlFromEle = (id as HTMLImageElement).src
        console.log(imgUrlFromEle,"imgUrlFromEle")
        if(imageUpload === null) return null;
        const imageRef =  ref(storage, `/images/${user.uid}/profile_image/profile_img.png`);
        uploadBytes(imageRef, imageUpload)
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
        if(imageUpload === null) return null;
        const imageRef =  ref(storage, `/images/${user.uid}/background_image/background_img`);
        uploadBytes(imageRef, imageUpload).then(() => {
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
                <h3>Edit Profile</h3> <button onClick={handleSave}>Save</button>

                <div className="img-upload-wrapper-container">
                    <div className="upload-profile-pic-container">
                    <span className="upload-img-title">Profile Image</span>
                        <label htmlFor="label-id-prof-pic-upload" className="upload-profile-pic-file-input">
                            Add Image
                        </label>
                        <input 
                            id="label-id-prof-pic-upload"
                            type="file"
                            onChange={(e) => 
                                e.target.files !== null ?
                                (setImageUpload(e.target.files[0]), handleOnChange(e)) :
                                null
                            }
                        ></input>
                        {/* <button onClick={handleClick}>Upload Profile Picture</button> */}
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
                                    (setImageUpload(e.target.files[0]), handleOnChange(e)) :
                                    null
                                }
                            ></input>
                            {/* <button onClick={handleClick2}>Upload Background Image</button> */}
                    </div>
                </div>
                <div className="update-name-container">
                    <input 
                        type="text" 
                        onChange={(e) => setNameTempText(e.target.value)}
                    ></input>
                    {/* <button type="submit" onClick={handleClick3}>Update Name</button> */}
                </div>
                <div className="update-bio-container">
                    <input 
                        type="text" 
                        onChange={(e) => setTempBioText(e.target.value)}
                    ></input>
                    {/* <button type="submit" onClick={handleClick4}>Update Bio</button> */}
                </div>
            </div>
    )}

export default EditProfile;