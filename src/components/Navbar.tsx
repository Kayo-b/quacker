import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Searchbar from "./Searchbar";

const Navbar = () => {

    const navigate = useNavigate();

    return(
        <div className="nav-main-container" data-testid="navbar-container">
            <div className="search-container" data-testid="navbar-search-container">
                <Searchbar/>
                </div>
        </div>
    )
}

export default Navbar;