import React from 'react';

type GifSearchProps = {
    setSelectedImg: React.Dispatch<React.SetStateAction<String>>;
}

const GifSearch: React.FC<GifSearchProps> = ({setSelectedImg}) => {
    // Add any props you need here
    const [gifSearch, setGifSearch] = React.useState<String>('');
    
    // Add your component logic here
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGifSearch(e.target.value);
      };
    
      // Function to search Giphy for GIFs
    function searchGiphy(query: String) {
        const apiKey = '210s9NI9jrEZ5hN4EHBHe6NzBd1harke';
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=10&offset=0&rating=g&lang=en`;
      
        fetch(url)
          .then(response => response.json())
          .then(content => {
            // Process and display GIFs
            console.log(content.data);
            content.data.forEach((gif: any) => {
              const img = document.createElement('img');
              img.addEventListener('click', () => {
                setSelectedImg(gif.images.fixed_height.url);
              })
              img.src = gif.images.fixed_height.url;
              document.querySelectorAll('.gif-search-container')[0].appendChild(img);
            });
          })
          .catch(err => {
              console.error('Error fetching from Giphy:', err);
          });
      }
    return (
        // Add your JSX code here
        <div className="gif-search-container">
        <label htmlFor="gif-search" >
            <input type="text" id="gif-search" onChange={(e) => handleInputChange(e)}></input>
            <button onClick={() => searchGiphy(gifSearch)}>Search</button>
        </label>
        {/* <input type="text" id="gif-search-box" onChange={e => handleInputChange(e)}></input> */}
        
    </div>
    );
};

export default GifSearch;
