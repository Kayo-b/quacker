import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
            
        </div>
    )
}

export default Sidebar;