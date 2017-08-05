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

import React, {Component} from 'react';
import {Link, IndexLink} from 'react-router';
import {ApiHelper} from '../../helpers/apiHelper';

const NUMBER_OF_COLUMNS = 3;

/**
 * The Header component class
 * 
 * @export
 * @class Header
 * @extends {Component}
 */
export class Header extends Component {

  /**
   * Creates an instance of Header.
   * @memberof Header
   */
  constructor() {
    super();
    this.state = {
      locationTags: [],
      currentLocationTag: "",
      defaultLocation: "",
      currentUser: ""
    };
  }

  /**
   * This method fetches the location and session when the component
   * mounts
   * 
   * @memberof Header
   */
  componentWillMount() {
    this.fetchLocation('/location').then((response) => {
      this.setState({locationTags: response.results});
      this.setState({defaultLocation: response.results[0].display});
    });

    this.fetchLocation('/session').then((response) => {
      this.setState({currentUser: response.user.display});
    });
  }

  /**
   * This method fetches the locations
   * 
   * @returns 
   * @memberof Header
   */
  getLocations() {
    return this.state.locationTags.map((location) => {
      return location.display;
    });
  }

  /**
   * This method fetches the data from a url
   * 
   * @param {String} url 
   * @returns {Object} getData 
   * @memberof Header
   */
  fetchLocation(url) {
    const apiHelper = new ApiHelper(null);
    const getData = new Promise(function(resolve, reject) {
      apiHelper.get(url).then(response => {
        response.json().then(data => {
          resolve(data);
        });
      });
    });
    return getData;
  }

  /**
   * This method habdles the click event
   * 
   * @param {Object} e Te event 
   * @memberof Header
   */
  handleClick(e) {
    e.preventDefault();
    this.setState({currentLocationTag: e.target.id});
  }

  /**
   * This method renders and pupulate the dropdown menu
   * 
   * @param {Object} locationTags 
   * @returns 
   * @memberof Header
   */
  dropDownMenu(locationTags) {
    const menuDisplay = [];
    const numPerColumn = Math.ceil(locationTags.length / NUMBER_OF_COLUMNS);
    for (let cols = 0; cols < NUMBER_OF_COLUMNS; cols++) {
      const menuInColumns = [];
      let colStart = cols * numPerColumn;
      let colEnd = (cols + 1) * numPerColumn;
      for (let menuIndex = colStart; menuIndex < colEnd; menuIndex++) {
        menuInColumns.push(
                    <a href="#" key={menuIndex} id={locationTags[menuIndex]} onClick={(e) => {
                      e.preventDefault();
                      this.handleClick(e);
                    }}>{locationTags[menuIndex]}</a>
                );
      }
      menuDisplay.push(
                <li className="col-sm-4" key={cols}>{menuInColumns}</li>
            );
    }

    return menuDisplay;
  }

  /**
   * This method renders the component
   * 
   * @returns {Object} The JSX component
   * @memberof Header
   */
  render() {
    return (
        <header>
            <div className="logo" id="logoId">
                <a href="../../">
                    <img src="img/openmrs-with-title-small.png"/>
                </a>
            </div>

            <ul className="navbar-right nav-header">
                <Link to="" activeClassName="active">
                    <li className="dropdown">
                        <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                            <span className="glyphicon glyphicon-user"/> {' ' + this.state.currentUser}
                            <span className="caret"/>
                        </a>
                        <ul className="dropdown-menu user">
                            <li>
                                <a href="#">My Account</a>
                            </li>
                        </ul>
                    </li>
                </Link>

                <Link to="" activeClassName="active">
                    <li className="dropdown dropdown-large">
                        <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                            <span className="glyphicon glyphicon glyphicon-map-marker"/> {(this.state.currentLocationTag != "")
                                ? this.state.currentLocationTag
                                : this.state.defaultLocation}
                            <span className="caret"/>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-large row">
                            {/*Execute the function*/}
                            {this.dropDownMenu(this.getLocations())}
                        </ul>
                    </li>
                </Link>

                <Link to="" activeClassName="active">
                    <li>
                        <a href="#">Logout {' '}
                            <span className="glyphicon glyphicon-log-out"/></a>
                    </li>
                </Link>
            </ul>
        </header>
    );
  }
}
