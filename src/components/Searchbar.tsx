
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";


const Searchbar = () => {
const[text, setText] = useState("");
const navigate = useNavigate();
const searchContainer = document.querySelector('.searchContainer');
const handleClick = async (text: String) => {
        navigate(`/search/${text}`);
        (searchContainer as HTMLElement).style.display = 'none';
    };
    const activateSearch = (e:any) => {
        if(searchContainer) console.log((searchContainer as HTMLElement).style.display)
        if(searchContainer && (searchContainer as HTMLElement).style.display === 'none'){
            (searchContainer as HTMLElement).style.display = 'flex';
            (searchContainer.children[0].children[0] as HTMLElement).focus()
        } else {
            if(searchContainer)(searchContainer as HTMLElement).style.display = 'none';
        }
        
    }
    const blurEffect = (e:any) => {
        const activeEle = document.activeElement
        if(activeEle && activeEle.className !== 'searchButton') {
                if(searchContainer)(searchContainer as HTMLElement).style.display = 'none';
        }   
    }
    return(
        <div className="search-main-container" data-testid="searchbar-container">
            <button className="mobile-search-btn" onClick={activateSearch} data-testid="searchbar-mobile-button">
                 <IoIosSearch style={{height:'20px', width:'20px'}}/>
            </button>
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
                    onBlur={(e) => setTimeout(() => {blurEffect(e)},1)}
                    data-testid="searchbar-input"
                ></input>
                <button className="searchButton"
                        value="Search" 
                        onClick={() => handleClick(text)}
                        data-testid="searchbar-submit-button">
                    <IoIosSearch className="searchButton" style={{height:'20px', width:'20px'}}/>
                </button> 
        </div>
            </div>
                </div>

        )

}

export default Searchbar;