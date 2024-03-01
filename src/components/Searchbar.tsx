import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";


const Searchbar = () => {
const[text, setText] = useState("");
const navigate = useNavigate();
const handleClick = async (text: String) => {
    navigate(`/search/${text}`);
  };

    return(
        <div className="search-main-container">
            <div className="searchContainer">
                <div className="searchElem">
                <input
                    type="text"
                    className="search"
                    placeholder="Look for..."
                    onChange={e => setText(e.target.value)}
                    onKeyDown={(e) =>
                    e.key === "Enter" ? handleClick(text) : () => null
                    }
                ></input>
                <button className="searchButton"
                        value="Search" 
                        onClick={() => handleClick(text)}>
                    <IoIosSearch style={{height:'20px', width:'20px'}}/>
                </button> 
        </div>
            </div>
                </div>

        )

}

export default Searchbar;