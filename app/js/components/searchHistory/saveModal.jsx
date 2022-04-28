/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React,{ Component, PropTypes } from 'react';

class Modal extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: false
    };
    this.onSave = this.onSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const state = {
      description: nextProps.description,
      index: nextProps.index,
      loading: nextProps.loading
    };
    nextProps.error ? state.error = nextProps.error : "";

    this.setState(state);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name] : event.target.value
    });
  }
    
  reset() {
    this.setState({ searchName : ""});
  }

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
                this.state.error ?
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
                      className="form-control"
                      placeholder="Enter a descriptive Name" 
                    />
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

Modal.propTypes = {
  description: PropTypes.string,
  index: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  saveSearch: PropTypes.func
};

export default Modal;
