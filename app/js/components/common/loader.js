import React from 'react';

const Loader = () => {
  const style = {
    width: '128',
    height: '128',
    margin: 'auto'
  }
  return(
    <div style={style}>
      <img src="./img/loader.gif" />
    </div>
  );
};

export default Loader;
