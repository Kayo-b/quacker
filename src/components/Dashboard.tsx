import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";


function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name)
        } catch(err: unknown) {
            if(err instanceof Error) {
                console.error(err)
                alert(err.message)
            } else {
                console.error(err)
                alert("an error has occurred")
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
