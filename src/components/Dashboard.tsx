import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";


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
}

const Dashboard: React.FC<DashboardProps> = ({user, loading, error, name, setName})  => {
    console.log(user)
    const navigate = useNavigate();
    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            console.log(doc.docs[0]);
            const data = doc.docs[0].data();
            setName(data.name)
        } catch(err: unknown) {
            if(err instanceof Error) {
                console.error(err);
                alert(err.message);
            } else {
                console.error(err);
                alert("an error has occurred");
            }
    }
}

    useEffect(() => {
        if(loading) return;
        if(!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);

  return (
    <div className="dashboard">
        <div className="dashboard-container">
            {!user ? "Logged Out" : "Logged in as:"} <div>{name}</div>
            <div>{user?.email}</div>
            {user ? <button 
            className="dashboard-btn" 
            onClick={logout}>
            Logout
            </button> : null}
        </div>
    </div>
  );
}


export default Dashboard
