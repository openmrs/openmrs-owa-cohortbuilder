import React, {Component} from 'react';
import {Link} from 'react-router';

import './breadCrumb.css';

class BreadCrumbComponent extends Component{
    componentDidMount(){}

    render(){
        return (
            <div className="breadcrumb">
                <a href="/openmrs" className="breadcrumb-item">
                    <span className="glyphicon glyphicon-home breadcrumb-item" aria-hidden="true"></span>
                </a>
                <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator" aria-hidden="true"></span>
                <span className="title breadcrumb-item">Cohort Builder</span>
            </div>
        );
    }
}

export default BreadCrumbComponent;