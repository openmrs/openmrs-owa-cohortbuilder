/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {Component} from 'react';
import {Link, IndexLink} from 'react-router';
import {ApiHelper} from '../../helpers/apiHelper';

const NUMBER_OF_COLUMNS = 3;

export class Header extends Component {
  constructor() {
    super();
    this.state = {
      locationTags: [],
      currentLocationTag: "",
      defaultLocation: "",
      currentUser: ""
    };
  }
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
   * This method fetches the locations to display on the 
   * navigation bar
   * 
   * @returns {Object} location.display
   * @memberof Header
   */
  getLocations() {
    return this.state.locationTags.map((location) => {
      return location.display;
    });
  }

  /**
   * This method fetches the data from the parameter 
   * that is passed into it
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
   * This method is used to set and change the location being 
   * displayed on the navigation bar
   * 
   * @param {Object} e the dropdown menu event 
   * @memberof Header
   */
  handleClick(e) {
    e.preventDefault();
    this.setState({currentLocationTag: e.target.id});
  }

  /**
   * This method renders and pupulate the dropdown menu being displayed
   * on the navigation bar
   * 
   * @param {Object} locationTags an array of the items to display
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
