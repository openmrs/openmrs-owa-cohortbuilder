import React, { PropTypes } from 'react';

const Loader = ({message}) => {
  return(
    <div>
      <p className="text-center text-danger">{message}</p>
    </div>
  );
};

Loader.propTypes = {
  message: PropTypes.string.isRequired
};

export default Loader;
