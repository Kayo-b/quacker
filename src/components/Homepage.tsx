import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Post from './Post'
import Feed from './Feed'

const Homepage = () => {
    const [update, setUpdate] = useState<boolean | undefined>(false)
    console.log(update)
    return(
        <div className="home-main-container">
            < Post setUpdate={setUpdate} update={update} />
            < Feed setUpdate={setUpdate} update={update}/>
        </div>
    )
}

export default Homepage;