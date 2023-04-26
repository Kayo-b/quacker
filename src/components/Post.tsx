import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const handleClick = (text: String | Number) => {
    console.log(text);
    // handle form submission here
  };

const Post = () => {
const[text, setText] = useState("");

    return(
        <div className="post-main-container">     
            <input 
            type="text" placeholder="Say something..."
            value={text} 
            onChange={e => setText(e.target.value)}>
            </input>
            <input 
            type="button" value="Post" 
            onClick={() => handleClick(text)}>
            </input>
        </div>
    )
}

export default Post;