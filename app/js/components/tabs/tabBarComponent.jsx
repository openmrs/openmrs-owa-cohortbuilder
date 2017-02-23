import React, {PropTypes} from 'react';

const TabBarComponent = (props) => {
        return (
            <div>
                <ul className="nav nav-tabs">
                    {props.tabs.map(props.drawTabHeader)}
                </ul>
            </div>
        );
}

TabBarComponent.propTypes = {
    tabs: PropTypes.array.isRequired,
    drawTabHeader: PropTypes.func.isRequired
}

export default TabBarComponent;
