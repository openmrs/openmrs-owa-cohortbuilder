import React, {Component} from 'react';

class ConceptComponent extends Component {
    componentDidMount(){}
    render(){
        return (
            <div className="content">
                <label htmlFor="">
                    Search by Concepts and Observations
                    <input type="text" className="form-control" placeholder="Input Value"/>
                </label>
                <label htmlFor="">
                    Include Verbose
                    <input type="checkbox"/>
                </label>
            </div>
        );
    }
}

export default ConceptComponent;