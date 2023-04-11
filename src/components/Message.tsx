import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Message = () => {

    return(
        <div className="msg-main-container">
            <ul> 
                <Link to="homepage"></Link>   
                <li>Homepage</li>
            </ul>
            
        </div>
    )
}

export default Message;