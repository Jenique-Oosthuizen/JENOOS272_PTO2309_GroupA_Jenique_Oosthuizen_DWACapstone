/**
 * An array of category names used for genre selection in the navigation bar.
 * 
 * @constant {Array<string>}
 */
const categories = [
    'Home', 'Personal Growth', 'True Crime and Investigative Journalism', 'History', 'Comedy', 
    'Entertainment', 'Business', 'Fiction', 'News', 'Kids & Family'
  ];

/**
 * Header component for the podcast platform's main page.
 * 
 * This component includes the logo, navigation buttons for categories, 
 * a search bar, sorting options, and buttons for accessing the user's favorites and account pages.
 * 
 * @component
 * @param {Object} props - Props passed to the component.
 * @param {Function} props.onGenreSelect - Callback function to handle genre/category selection.
 * @param {Function} props.onViewChange - Callback function to handle navigation to different views (e.g., 'favourites', 'account').
 * @param {Function} props.onSearch - Callback function to handle changes in the search input field.
 * @param {Function} props.onSortChange - Callback function to handle sorting changes from the dropdown menu.
 * 
 * @returns {JSX.Element} - The rendered Header component.
 */
export default function Header({ onGenreSelect, onViewChange, onSearch, onSortChange }) {

  /**
   * Handles the search input change and triggers the `onSearch` callback with the search term.
   * 
   * @param {Object} event - The event object from the input field.
   */
  const handleSearchChange = (event) => {
    onSearch(event.target.value); // Pass the search value to the parent component
  };

  /**
   * Handles sorting selection changes and triggers the `onSortChange` callback with the selected value.
   * 
   * @param {Object} event - The event object from the select dropdown.
   */
  const handleSortChange = (event) => {
    onSortChange(event.target.value); // Pass the sort selection to the parent component
  };

    return (
        <header className="header">
          <div className="logo-header">
            <div className="logo-container">
              <svg
                className="logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="40"
                height="40"
              >
                  <path d="M22,13a9.01,9.01,0,0,1-9,9H11a9.011,9.011,0,0,1-9-9H0A11.013,11.013,0,0,0,11,24h2A11.013,11.013,0,0,0,24,13Z"/>
                  <path d="M9,13H5.071a7,7,0,0,0,13.858,0H15V11h4V8H15V6h3.929A7,7,0,0,0,5.071,6H9V8H5v3H9Z"/>
              </svg>
              <h1>PODCAST PLANET</h1>
            </div>
            
            <div className="favourites-container" >
              {/* Button to navigate to the "favourites" view */}
            <button className="header-fav-button" onClick={() => onViewChange('favourites')}>
              <svg
                className="favourites-image"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"/>
              </svg>

              <h3 className="fav-title">Favourites</h3>
            </button>

            {/* Button to navigate to the "account" view */}
            <button className="account-button" onClick={() => onViewChange('account')}>
              <svg
                className="account-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z"/>
                <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z"/>
              </svg>
            </button>
            </div>
          </div>
          
          {/* Navigation buttons for categories */}
          <nav className="nav-categories">
            {categories.map((category, index) => (
            <button key={index} className="category-btn" onClick={() => onGenreSelect(category)}>
            {category}
            </button>
            ))}
          </nav>
    
          {/* Search bar for searching shows */}
          <div className="search-bar">
            <input type="text" placeholder="Search" onChange={handleSearchChange} />
          </div>

            <hr></hr>

          {/* Dropdown for sorting shows */}
          <div className="arrange-alphabetical">
            <select onChange={handleSortChange} >
              <option value="all">All</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="date-asc">Date Updated (Ascending)</option>
              <option value="date-desc">Date Updated (Descending)</option>
            </select>
          </div>

        </header>
      );
}