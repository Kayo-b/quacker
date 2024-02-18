import React from 'react';
import { useEffect } from 'react';

type GifSearchProps = {
    setSelectedImg: React.Dispatch<React.SetStateAction<String>>;
    closeGifModal: () => void;
}

const GifSearch: React.FC<GifSearchProps> = ({setSelectedImg, closeGifModal}) => {
    // Add any props you need here
    const [gifSearch, setGifSearch] = React.useState<String>('');
    
    // Add your component logic here
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGifSearch(e.target.value);
      };
    
    function trendingGifs() {
        const apiKey = '210s9NI9jrEZ5hN4EHBHe6NzBd1harke';
        const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10&rating=g`;
        //remove all children from trending-gifs
        // let children = document.querySelectorAll('.trending-gifs')[0].children;
        // for(let i = 0; children.length; i++) {
        //   children[i].remove();
        // }
        fetch(url)
          .then(response => response.json())
          .then(content => {
            // Process and display GIFs
            console.log(content.data);
            if(!document.querySelectorAll('.trending-gifs')[0].hasChildNodes())
            content.data.forEach((gif: any) => {
              const img = document.createElement('img');
              img.addEventListener('click', () => {
                setSelectedImg(gif.images.fixed_height.url);
                closeGifModal();
              })
              img.src = gif.images.fixed_height.url;

              document.querySelectorAll('.trending-gifs')[0].appendChild(img);
  
              
            });
          })
          .catch(err => {
              console.error('Error fetching from Giphy:', err);
          });
    }

      // Function to search Giphy for GIFs
    function searchGiphy(query: String) {
        const apiKey = '210s9NI9jrEZ5hN4EHBHe6NzBd1harke';
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=10&offset=0&rating=g&lang=en`;
        const gifSearchContainer = document.querySelectorAll('.gif-search-result')[0];
        if(gifSearchContainer.hasChildNodes()) {
          gifSearchContainer.innerHTML = '';
        }
        fetch(url)
          .then(response => response.json())
          .then(content => {
            if(content.data.length === 0) {
              const noResults = document.createElement('p');
              noResults.textContent = 'No results found';
              gifSearchContainer.appendChild(noResults);
            }
            console.log(content.data);
            content.data.forEach((gif: any) => {
              const img = document.createElement('img');
              img.addEventListener('click', () => {
                setSelectedImg(gif.images.fixed_height.url);
                closeGifModal();
              })
              img.src = gif.images.fixed_height.url;
              gifSearchContainer.appendChild(img);
              (document.querySelectorAll('.trending-gifs')[0] as HTMLElement).style.display = 'none';
            });
          })
          .catch(err => {
              console.error('Error fetching from Giphy:', err);
          });
      }

      // useEffect(() => { 
      //   trendingGifs();
      // },[])
      trendingGifs();
    return (
        // Add your JSX code here
        <div className="gif-search-container">
        <label htmlFor="gif-search" >
            <input type="text" id="gif-search" onChange={(e) => handleInputChange(e)}                     onKeyDown={(e) =>
                    e.key === "Enter" ? searchGiphy(gifSearch) : () => null
                    }></input>
            <button className={"gif-search-button"} onClick={() => searchGiphy(gifSearch)}>Search</button>
            <div className="gif-search-result"></div>
            <div className="trending-gifs"></div>
        </label>
        {/* <input type="text" id="gif-search-box" onChange={e => handleInputChange(e)}></input> */}
        
    </div>
    );
};

export default GifSearch;
