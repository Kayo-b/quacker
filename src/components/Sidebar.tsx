import React, { useState, useEffect } from "react";
import { RxHome } from 'react-icons/rx'
import { BsStar } from 'react-icons/bs'
import { Link } from "react-router-dom";
import { DocumentData } from 'firebase/firestore'
import Dashboard from "./Dashboard";


type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
    
}  

type SidebarProps = { 
    user: UserProps;
    loading: boolean;
    error: string;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    userID: string;
    setUserID: React.Dispatch<React.SetStateAction<string>>;
    userData?: DocumentData;
}

const Sidebar: React.FC<SidebarProps> = ({name, user, loading, error, setName, userID, setUserID}) => {

    return(
        <div className="sb-main-container">
            <ul className="side-bar-menu"> 
                <Link to="/homepage"> 
                    <li><RxHome className="home-icon"/></li>
                </Link>  
                <Link to="/bookmarks"> 
                    <li><BsStar className="star-icon"/></li>
                </Link>  
            </ul>
            <div className="sidebar-dashboard">
                <div className="sidebar-dashboard-container">
                <Dashboard 
                name={name} 
                userID={userID}
                setUserID={setUserID}
                user={user} 
                loading={loading} 
                error={error} 
                setName={setName}
                />
                </div>
            </div>  
        </div>
    )
}

export default Sidebar;