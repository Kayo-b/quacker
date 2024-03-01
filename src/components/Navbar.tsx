import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Searchbar from "./Searchbar";

const Navbar = () => {

    const navigate = useNavigate();

    return(
        <div className="nav-main-container">
            <div className="search-container">
                <Searchbar/>
                </div>
        </div>
    )
}

export default Navbar;