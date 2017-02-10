import React, { PropTypes } from 'react';

const TabContentComponent = (props) => {
     return (
            <div className="tab-content">
                {props.tabs.map(props.drawComponent)}
            </div>
        );
};

TabContentComponent.propTypes = {
    tabs: PropTypes.array.isRequired,
    drawComponent: PropTypes.func.isRequired
}

export default TabContentComponent;
