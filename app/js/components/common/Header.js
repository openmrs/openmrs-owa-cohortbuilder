/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { Component } from "react";
import { Link, IndexLink } from "react-router";
import { ApiHelper } from "../../helpers/apiHelper";

const NUMBER_OF_COLUMNS = 3;

const LOGIN_LOCATION_TAG_NAME = 'Login%20Location';

export class Header extends Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      currentLocationTag: "",
      defaultLocation: "",
      currentUser: "",
      currentLogOutUrl: ""
    };
    this.getUri = this.getUri.bind(this);
    this.dropDownMenuClick = this.dropDownMenuClick.bind(this);
  }

  componentWillMount() {
    this.fetchLocation("/location?tag="+LOGIN_LOCATION_TAG_NAME).then(response => {
      if (response && response.results) {
        this.setState({ locations: response.results });
        this.setState({ defaultLocation: response.results.length > 0 ? response.results[0].display : null });
        this.getUri();
      }
    });

    this.fetchLocation("/session").then(response => {
      if (response && response.user) {
        this.setState({ currentUser: response.user.display });
      }
    });
  }

  getLocations() {
    return this.state.locations.map(location => {
      return location.display;
    });
  }

  getUri() {
    this.state.locations.map(location => {
      let url = location.links[0].uri;
      let arrUrl = url.split("/");
      let customUrl = `/${arrUrl[3]}/appui/header/logout.action?successUrl=${
        arrUrl[3]
      }`;
      this.setState({ currentLogOutUrl: customUrl });
      return customUrl;
    });
  }

  fetchLocation(url) {
    const apiHelper = new ApiHelper(null);
    const getData = new Promise(function(resolve, reject) {
      apiHelper.get(url).then(data => {
         resolve(data);
      });
    });
    return getData;
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ currentLocationTag: e.target.id });
  }

  dropDownMenuClick(e) {
    e.preventDefault();
    this.handleClick(e);
  }

  dropDownMenu(locations) {
    const menuDisplay = [];
    const numPerColumn = Math.ceil(locations.length / NUMBER_OF_COLUMNS);
    for (let cols = 0; cols < NUMBER_OF_COLUMNS; cols++) {
      const menuInColumns = [];
      let colStart = cols * numPerColumn;
      let colEnd = (cols + 1) * numPerColumn;
      for (let menuIndex = colStart; menuIndex < colEnd; menuIndex++) {
        menuInColumns.push(
          <a
            href="#"
            key={menuIndex}
            id={locations[menuIndex]}
            onClick={this.dropDownMenuClick}
          >
            {locations[menuIndex]}
          </a>
        );
      }
      menuDisplay.push(
        <li className="col-sm-4" key={cols}>
          {menuInColumns}
        </li>
      );
    }

    return menuDisplay;
  }
  render() {
    return (
      <header>
        <div className="logo" id="logoId">
          <a href="../../">
            <img src="img/openmrs-with-title-small.png" />
          </a>
        </div>

        <ul className="navbar-right nav-header">
          <Link to="" activeClassName="active">
            <li className="dropdown">
              <a
                className="dropdown-toggle"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="glyphicon glyphicon-user" />{" "}
                {" " + this.state.currentUser}
                <span className="caret" />
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
              <a
                className="dropdown-toggle"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="glyphicon glyphicon glyphicon-map-marker" />{" "}
                {this.state.currentLocationTag != ""
                  ? this.state.currentLocationTag
                  : this.state.defaultLocation}
                <span className="caret" />
              </a>
              <ul className="dropdown-menu dropdown-menu-large row">
                {this.dropDownMenu(this.getLocations())}
              </ul>
            </li>
          </Link>

          <Link to="" activeClassName="active">
            <li>
              <a href={this.state.currentLogOutUrl}>
                Logout <span className="glyphicon glyphicon-log-out" />
              </a>
            </li>
          </Link>
        </ul>
      </header>
    );
  }
}
