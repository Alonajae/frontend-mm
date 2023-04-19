import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {

  const [moviesData, setMoviesData] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Movies list

  useEffect(() => {
    fetch('https://backend-mm.vercel.app//movies')
      .then(response => response.json())
      .then(data => {
        const moviesData = data.movies.map((movie, i) => {
          const isLiked = likedMovies.some(likedMovie => movie.title === likedMovie.title);
          if(movie.overview.length > 250) {
            movie.overview = movie.overview.substring(0, 250) + '...';
          }
          if(movie.poster_path === null) {
            movie.poster_path = movie.title + '.jpg';
          }
          return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={movie.title} overview={movie.overview} poster={movie.poster_path} voteAverage={movie.vote_average} voteCount={movie.vote_count} />;
        });
  setMoviesData(moviesData);
})
  }, []);

return (
  <div className={styles.main}>
    <div className={styles.header}>
      <div className={styles.logocontainer}>
        <img src="logo.png" alt="Logo" />
        <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
      </div>
      <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
        <Button>♥ {likedMovies.length} movie(s)</Button>
      </Popover>
    </div>
    <div className={styles.title}>LAST RELEASES</div>
    <div className={styles.moviesContainer}>
      {moviesData}
    </div>
  </div>
);
}

export default Home;