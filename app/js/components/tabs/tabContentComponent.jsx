import React, { PropTypes } from 'react';

const TabContentComponent = (props) => {
     return (
            <div className="tab-content">
                {props.drawComponent(props.tabs, props.fetchData, props.search, props.addToHistory)}
            </div>
        );
};

TabContentComponent.propTypes = {
    tabs: PropTypes.array.isRequired,
    drawComponent: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
}

export default TabContentComponent;
