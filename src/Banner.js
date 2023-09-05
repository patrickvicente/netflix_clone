import React, { useState,useEffect } from 'react';
import './Banner.css';
import axios from './axios';
import requests from './Requests';


function Banner() {
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        // Fetches data from TMDB using API
        async function fetchData() {
            const request = await axios.get(requests.fetchNetflixOriginals);
            setMovie(
                // Randomizes the movie result that is showing
                request.data.results[
                    Math.floor(Math.random() * request.data.results.length - 1)
                ]
            );
            return request;
        }

        fetchData();
    }, []);

    // Truncates longer paragraphs to the value of n
    function truncate(string, n) {
        return string?.length > n ? string.substr(0, n-1) + "..." : string;
    }
  return (
    <header className='banner' style={{
        backgroundSize: "cover",
        // Fetches the image of the current randomized movie
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
    }}>
        <div className="banner__contents">
            <h1 className="banner__title">
                {movie?.title || movie?.name || movie.original_name}
            </h1>
            <div className="banner__buttons">
                <button className='banner__button'>Play</button>
                <button className='banner__button'>My List</button>
            </div>
            <h1 className="banner__description">
                {truncate(movie?.overview, 150)}
            </h1>
        </div>
        <div className="banner--fadeBottom" />

    </header>
  )
}

export default Banner;