import React, { useState, useEffect } from 'react'
import axios from './axios'
import './Row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const base_url = "https://image.tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("")

    // run this code whenever a row is loaded
    useEffect(() => {

        async function fetchData() {
            const request = await axios.get(fetchUrl)
            setMovies(request.data.results)
            return request
        }
        fetchData()
    }, [fetchUrl]) // if [], run once when the row loads, and dont run again, need to include any variables passed from outside the block

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        }
    }

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl('')
        } else {
            movieTrailer(movie?.name || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search)
                setTrailerUrl(urlParams.get('v'))
            })
            .catch(error => console.log(error))
        }
    }

    console.log(movies)
    return (
        <div className='row'>
            <h2>{title}</h2>

            {/* container -> posters */}
            <div className='row__posters'>
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={'row__poster '+(isLargeRow && "row__posterLarge")}
                        src={base_url+movie.poster_path}
                        alt={movie.name}
                    />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row