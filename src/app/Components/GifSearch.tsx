/* @jsxImportSource react */
'use client';
/* @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

import { auth, addDoc, collection, db } from '../../firebase'; // Update the path accordingly

interface Gif {
  id: string;
  title: string;
  username: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
}

const GifSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const apiKey = '9Ixlv3DWC1biJRI57RanyL7RTbfzz0o7';
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const gifsPerPage = 10;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    // Reset current page to 1 when a new search query is entered
    setCurrentPage(1);
  };
  const handleFavorite = async (gif: Gif) => {
    try {
      const user = auth.currentUser;

      if (user) {
        const favoriteData = {
          userId: user.uid,
          gifId: gif.id,
          gifTitle: gif.title,
          gifUsername: gif.username,
          gifUrl: gif.images.fixed_height.url,
          timestamp: new Date(),
        };

        const docRef = await addDoc(collection(db, 'favorites'), favoriteData);
        console.log('Favorite GIF stored with ID:', docRef.id);

        toast.success('GIF favorited successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.warn('User not logged in. Unable to favorite GIF.');
      }
    } catch (error) {
      console.error('Error favoriting GIF:', error);

      toast.error('Error favoriting GIF. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const fetchGifs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${apiKey}&limit=${gifsPerPage}&offset=${(currentPage - 1) * gifsPerPage}`
      );
      setGifs(response.data.data);
      console.log(response.data.data);
      setTotalPages(Math.ceil(response.data.pagination.total_count / gifsPerPage));
      
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    fetchGifs();
  }, [query, apiKey, currentPage]);

  return (
    <>
      <Navbar onSearch={handleSearch} loading={loading} />

      <div className="relative h-screen">
        <div className="flex flex-col items-center h-full p-4 bg-white">
          <ToastContainer />
          {/* Loader */}
          {loading && (
            <img
              src="/images/loader.gif"
              alt="Loading"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10"
            />
          )}
          {/* gif fetcher component */}
          <div className="flex flex-wrap mt-4 ">
            {gifs.map((gif) => (
              <div key={gif.id} className="m-2 rounded shadow-lg">
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  style={{ maxWidth: '550px', maxHeight: '550px' }}
                />
                <p className="text-black p-2 inline-block">{gif.title}</p>
                <button onClick={() => handleFavorite(gif)} className="p-2 shadow-lg rounded-full inline-block">
                  ⭐
                </button>
                <p className="text-black p-2">@{gif.username}</p>
              </div>
            ))}
          </div>
{/* footer implementation for pages */}
          {totalPages > 0 && (
  <div className="mt-4 p-4">
    <button onClick={handlePrevPage} className="mr-2 px-4 py-2 text-black font-bold rounded shadow-lg">
      Previous
    </button>
    <span className="text-black">
      {[...Array(Math.min(totalPages - currentPage + 1, 3))].map((_, index) => (
        <button
          key={index + currentPage}
          onClick={() => setCurrentPage(index + currentPage)}
          className={`px-4 py-2 text-black font-bold rounded ${
            currentPage + index === currentPage ? 'bg-pink-300' : 'bg-gray-300'
          }`}
        >
          {currentPage + index}
        </button>
      ))}
      . . . 

    </span>
    <button onClick={handleNextPage} className="ml-2 px-4 py-2 text-black font-bold rounded shadow-lg">
      Next
    </button>
  </div>
)}

        </div>
      </div>
    </>
  );
};

export default GifSearch;

