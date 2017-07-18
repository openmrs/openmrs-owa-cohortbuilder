import React, { PropTypes } from 'react';

/**
 * This is the tabContent class
 * @param {*} props 
 */
class TabContentComponent extends React.Component{
    constructor(props){
        super(props);
        this.drawComponent = this.drawComponent.bind(this);
    }

    /**
     * This method designs the tab component content
     *
     * @param {Array} tabs This is an array of all the tabs to be displayed 
     * @param {Function} fetchData
     * @param {Function} search
     * @param {Function} addToHistory
     * @param {Funcnpption} getHistory
     */
    drawComponent(tabs, fetchData, search, addToHistory, getHistory) {
        return tabs.map((tab,index) => {
            return(
                <div id={tab.divId} key={index} className={'tab-pane ' + (tab.active ? 'active' : '')}>
                    <tab.component fetchData={fetchData} search={search} addToHistory={addToHistory} getHistory={getHistory} />
                </div>
            );
        });
    }
    
    render(){
        const {tabs, fetchData, search, addToHistory, getHistory } = this.props;
        return (
            <div className="tab-content">
                {this.drawComponent(tabs, fetchData, search, addToHistory, getHistory)}
            </div>
        );
    };
};

TabContentComponent.propTypes = {
    tabs: PropTypes.array.isRequired,
    fetchData: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    getHistory: PropTypes.func.isRequired,
    addToHistory: PropTypes.func
};

export default TabContentComponent;
