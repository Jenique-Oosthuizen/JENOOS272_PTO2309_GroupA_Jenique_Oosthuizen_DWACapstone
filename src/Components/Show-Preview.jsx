import { genreNames } from "../assets/GenreNames";

/**
 * ShowPreview component for displaying a preview of a podcast show.
 * 
 * This component renders information about a show such as its image, title, number of seasons, genres, 
 * and the last updated date. It also handles the click event for selecting a show.
 * 
 * @component
 * @param {Object} props - Props passed to the component.
 * @param {string} props.title - The title of the podcast show.
 * @param {string} props.image - The URL of the image representing the podcast show.
 * @param {Array<number>} props.genres - An array of genre IDs associated with the show.
 * @param {number} props.seasons - The number of seasons the podcast show has.
 * @param {string} props.updated - The last updated date of the show, in ISO 8601 format.
 * @param {Function} props.onClick - Callback function to handle the click event when a user selects the show.
 * 
 * @returns {JSX.Element} - The rendered ShowPreview component.
 */
export default function ShowPreview(props) {
    /**
     * Maps the array of genre IDs to their corresponding genre names using the `genreNames` object.
     * If a genre ID does not exist in `genreNames`, it returns "Unknown Genre".
     * 
     * @type {Array<string>}
     */
    const lookUpGenre = props.genres.map(genreID => genreNames[genreID] || "Unknown Genre")

    /**
     * Formats the `updated` date string into a more readable format (locale date string).
     * 
     * @type {string}
     */
    const formattedDate = new Date(props.updated).toLocaleDateString();

    return (
        <div className="showpreview" onClick={props.onClick}>
            <img className="showpreview-image" src={`${props.image}`} alt={props.title} />
            <h2 className="showpreview-title">{props.title}</h2>
            <p className="showpreview-seasons">Seasons: {props.seasons}</p>
            <p className="showpreview-genres">Genres: {lookUpGenre.join(', ')}</p>
            <p className="showpreview-updated">Updated: {formattedDate}</p>
        </div>
    )
}