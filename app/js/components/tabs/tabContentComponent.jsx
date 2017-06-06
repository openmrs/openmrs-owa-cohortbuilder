import React, { PropTypes } from 'react';

const TabContentComponent = (props) => {
     return (
            <div className="tab-content">
                {props.drawComponent(props.tabs, props.fetchData, props.search, props.addToHistory, props.getHistory)}
            </div>
        );
};

TabContentComponent.propTypes = {
    tabs: PropTypes.array.isRequired,
    drawComponent: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    getHistory: PropTypes.func.isRequired,
    addToHistory: PropTypes.func
};

export default TabContentComponent;
