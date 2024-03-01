import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where, DocumentData } from "firebase/firestore";


type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
}  

type DashboardProps = { 
    user: UserProps ;
    loading: boolean;
    error: string;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    userID: string;
    setUserID: React.Dispatch<React.SetStateAction<string>>;
    userData?: DocumentData;
    userImg?: string;
}

const Dashboard: React.FC<DashboardProps> = ({user, loading, error, name, setName, userID, setUserID, userData, userImg})  => {
    const navigate = useNavigate();
    const post = {
        username: name,
        userID: userID,
    }
    const location = useLocation();
    const currentURL = location.pathname;
    const fetchUserName = async () => {
        if(user?.uid === undefined) return;
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
            setUserID(data.uid);
        } catch(err: unknown) {
            console.error(err);
    }
}

const RedirectToProfilePage = (post: DocumentData | undefined) => {
    //Navigating first to homepage when accessing a profile from another profile as a workaround so that it renders the posts
    if(currentURL.startsWith(`/profile/`)) {
            navigate('/homepage/');
            setTimeout(() => {
                navigate(`/profile/${post?.username}`, {state: {post}});
            },100)
    } else {
        navigate(`/profile/${post?.username}`, {state: {post}});
    }
    
    //update === true ? setUpdate(false) : setUpdate(true);
}

    useEffect(() => {
        if(loading) return;
        if(!user) navigate("/");
        fetchUserName();
    }, [user, loading]);

    const Logout = () => {
        navigate("/");
        logout();
    }

  return (
    <div className="dashboard">
        <div className="dashboard-container">
             <img className="profile-picture" alt="user icon" src={userImg}></img>
            {!user ? "Logged Out" : ""} 
            <div className="profile-dashboard">
                <div onClick={() => RedirectToProfilePage(post)}>{name}</div>
                <div onClick={() => RedirectToProfilePage(post)}>{user?.email}</div>
            </div>
            {user ? <button 
            className="dashboard-btn" 
            onClick={Logout}>
            Logout
            </button> : null}
        </div>
    </div>
  );
}


export default Dashboard
