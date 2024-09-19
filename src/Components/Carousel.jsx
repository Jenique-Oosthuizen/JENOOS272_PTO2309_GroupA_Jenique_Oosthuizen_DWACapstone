import { useState, useEffect } from 'react';
import ShowPreview from './Show-Preview';

/**
 * Randomly selects a given number of shows from the provided list.
 * 
 * @function
 * @param {Array} shows - The array of show objects.
 * @param {number} count - The number of random shows to select.
 * @returns {Array} - An array containing the randomly selected shows.
 */
const getRandomShows = (shows, count) => {
  const shuffled = [...shows].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Carousel component for displaying a sliding set of random shows.
 * 
 * This component shows a set of shows, allows the user to navigate through them,
 * and randomly selects 10 shows to be displayed. Users can view a subset of these 
 * shows at a time and click on them to get more details.
 * 
 * @component
 * @param {Object} props - Props passed to the component
 * @param {Array} props.shows - The array of show objects to display in the carousel.
 * @param {Function} props.onShowClick - A callback function invoked when a show is clicked.
 * 
 * @returns {JSX.Element} - The rendered Carousel component.
 */
export default function Carousel({ shows, onShowClick }) {
  // State to store the shows currently being displayed in the carousel
  const [carouselShows, setCarouselShows] = useState([]);
  // State to track the current index of the visible set of shows
  const [currentIndex, setCurrentIndex] = useState(0);

  // The number of items (shows) to display per slide
  const itemsPerSlide = 5;

  /**
   * useEffect to set random shows when the shows array is updated.
   * This selects 10 random shows and stores them in the state.
   */
  useEffect(() => {
    if (shows.length > 0) {
      setCarouselShows(getRandomShows(shows, 10));
    }
  }, [shows]);

  /**
   * Moves to the next set of shows in the carousel.
   * Resets to the beginning if the end is reached.
   */
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerSlide >= carouselShows.length ? 0 : prevIndex + itemsPerSlide
    );
  };

  /**
   * Moves to the previous set of shows in the carousel.
   * Wraps around to the end if at the beginning.
   */
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselShows.length - itemsPerSlide : prevIndex - itemsPerSlide
    );
  };

  // Get the currently visible shows based on the currentIndex
  const visibleShows = carouselShows.slice(currentIndex, currentIndex + itemsPerSlide);

  return (
    <>
    <h3 className='carousel-title'>You may be interested in...</h3>
    <div className="carousel-container">
      {/* Previous button to move to the previous set of shows */}
      <button className="carousel-control prev" onClick={handlePrev}>
        &#10094;
      </button>
      {/* Container for displaying the current set of shows */}
      <div className="carousel-wrapper">
        {visibleShows.map((show) => (
          <ShowPreview
            key={show.id}
            {...show}
            onClick={() => onShowClick(show.id)}
          />
        ))}
      </div>
      {/* Next button to move to the next set of shows */}
      <button className="carousel-control next" onClick={handleNext}>
        &#10095;
      </button>
    </div>
    </>
  );
}