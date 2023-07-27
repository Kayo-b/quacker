import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
}

const Sidebar: React.FC<SidebarProps> = ({name, user, loading, error, setName, userID, setUserID}) => {

    return(
        <div className="sb-main-container">
            <ul> 
                <Link to="/homepage"> 
                    <li>Homepage</li>
                </Link>  
                <Link to="/bookmarks"> 
                    <li>Bookmarks</li>
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