import React, { useEffect, useState } from 'react'
import './Row.css';
import axios from './axios';

function Row({ title, fetchUrl, isLargeRow = false }) {
    const [movies, setMovies] = useState([]);
    const base_url = "https://image.tmdb.org/t/p/original/";

    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);

            return request;
        }

        fetchData();
        
    }, [fetchUrl]);

  return (
    <div className='row'>
        <h2>{title}</h2>
        <div className="row__posters">
            {/* Maps through the fetched movies and checks
            if the movie isLargeRow, if it is it shows poster, if not 
            it shows the backdrop */}
            {movies.map(movie => (
                /***  Checks if poster and backdrop is present
                  to prevent Dead Links ***/
                ((isLargeRow && movie.poster_path) ||
                (!isLargeRow && movie.backdrop_path)) && (
                    <img 
                    className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                    key={movie.id}
                    src={`${base_url}${
                        isLargeRow ? movie.poster_path : movie.backdrop_path
                    }`} alt={`${movie.name} poster`} /> 
                    )
            ))}
        </div>
    </div>
  )
}

export default Row