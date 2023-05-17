import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
    bookmarks?: Array<string>;
}  

type BookmarksProps = { 
    user: UserProps;
}

const Bookmarks: React.FC<BookmarksProps> = ({user}) => {

    return(
        <div className="bm-main-container">
            
        </div>
    )
}

export default Bookmarks;