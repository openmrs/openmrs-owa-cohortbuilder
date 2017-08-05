/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */

import React,{ Component, PropTypes } from 'react';

import { ApiHelper } from '../../helpers/apiHelper';
import { JSONHelper } from '../../helpers/jsonHelper';

/**
 * The Modal component class
 * 
 * @class Modal
 * @extends {Component}
 */
class Modal extends Component {

  /**
   * Creates an instance of Modal.
   * @param {Object} props 
   * @memberof Modal
   */
  constructor (props) {
    super(props);
    this.state = {
      loading: false
    };
    this.onSave = this.onSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
  }

  /**
   * This method updates the state with the new props
   * 
   * @param {Object} nextProps the new / updated props
   * @memberof Modal
   */
  componentWillReceiveProps(nextProps) {
    const state = {
      description: nextProps.description,
      index: nextProps.index,
      loading: nextProps.loading
    };
    nextProps.error ? state.error = nextProps.error : "";

    this.setState(state);
  }

  /**
   * This method maps the content of a form field to the 
   * state
   * 
   * @param {Object} event the event you want to map the state to 
   * @memberof Modal
   */
  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    });
  }
    
  /**
   * This method resets the value of the `searchName` to an empty
   * string
   * 
   * @memberof Modal
   */
  reset() {
    this.setState({ searchName : ""});
  }

  /**
   * The method handles the save event
   * 
   * @param {Oobject} event the event you want to save
   * @memberof Modal
   */
  onSave(event) {
    event.preventDefault();
    const { index, searchName } = this.state;
    if (searchName && searchName.length > 0 ) {
      this.props.saveSearch(index, searchName)
                .then((res) => {
                  res ? this.setState({ error: "", searchName: "" }) : "";
                });
            
    } else {
      this.setState({
        error : "The name field is required and be descriptive",
        loading: false
      });
    }
  }

  /**
   * This method renders the Modal Component
   * 
   * @returns 
   * @memberof Modal
   */
  render() {
    return (
            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title" id="myModalLabel">Save History</h4>
                    </div>
                    <div className="modal-body" onSubmit={this.onSave}>
                        {
                            this.state.error? 
                            <div className="alert alert-danger text-center">
                                { this.state.error}
                            </div>
                        : ""
                        }
                        <form className="form-horizontal col-md" id="saveHistory" action="">
                            <div className="form-group">
                                <div className="col-sm-12">
                                    <label htmlFor="description">Description</label>
                                    <input id="description" 
                                        type="text" 
                                        value={this.state.description} 
                                        onChange={this.handleChange} 
                                        className="form-control" 
                                        placeholder="description" disabled />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-12">
                                    <label htmlFor="searchName">History Name</label>
                                    <input id="searchName" 
                                        name="searchName" 
                                        type="text" 
                                        value={this.state.searchName} 
                                        onChange={this.handleChange}
                                        className="form-control" placeholder="Enter a descriptive Name" />
                                </div>
                            </div>
                        <button type="submit" className="btn btn-success submit" disabled={this.state.loading}>
                            {this.state.loading ? <img src="img/spin.gif"/> : "Save"}
                        </button>
                        <button onClick={this.reset} type="reset" className="btn btn-default cancelBtn">Reset</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
    );
  }
}

/**
 * Proptypes validation for the Modal component
 */
Modal.propTypes = {
  description: PropTypes.string,
  index: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  saveSearch: PropTypes.func
};

export default Modal;
