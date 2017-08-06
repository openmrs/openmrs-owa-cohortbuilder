import React, { PropTypes } from 'react';

/**
 * This method renders the Navigate component that 
 * displays the pagination
 * 
 * @param {Integer} currentPage the pageNumber of the page the user is currently on
 * @param {Integer} totalPage the total number of pages the user can navigate to
 * @param {Integer} navigatePage the pageNumber the user wants to navigate to
 */
export  const Navigate = ({currentPage, totalPage, navigatePage}) => {
  return(
        <div className="tableNavigation">
            <button className="btn btn-primary" onClick={navigatePage} value="first">FIRST</button>
            {
                (currentPage > 1) ?
                    <button className="btn btn-primary" onClick={navigatePage} value="previous">PREVIOUS</button> :
                    null
            }

            {
                (currentPage < totalPage) ?
                    <span>
                        <button className="btn btn-primary" onClick={navigatePage} value="next">NEXT</button>
                        <button className="btn btn-primary" onClick={navigatePage} value="last">LAST</button>
                    </span> :
                    null
            }
            <span className="page-display-counter">{currentPage + " of " + totalPage}</span>
        </div>
  );
};

Navigate.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
  navigatePage: PropTypes.func.isRequired
};
