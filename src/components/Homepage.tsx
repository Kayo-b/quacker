import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Post from './Post'
import Feed from './Feed'


type UserProps = {
    authProvider?: string;
    email: string;
    name?: string;
    uid: string;
}  

type HomepageProps = {
    name: string;
    user: UserProps;
}

const Homepage: React.FC<HomepageProps> = ({name, user}) => {
    const [update, setUpdate] = useState<boolean | undefined>(false)
    console.log(update)
    return(
        <div className="home-main-container">
            < Post setUpdate={setUpdate} update={update} name={name} user={user}/>
            < Feed setUpdate={setUpdate} update={update}/>
        </div>
    )
}

export default Homepage;