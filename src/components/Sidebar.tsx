import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

const Sidebar = () => {

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
                <Dashboard/>
                </div>
            </div>
            
            
        </div>
    )
}

export default Sidebar;