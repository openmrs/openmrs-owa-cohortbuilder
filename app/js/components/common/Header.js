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

    getLocations() {
        return this.state.locationTags.map((location) => {
            return location.display;
        });
    }

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

    handleClick(e) {
        e.preventDefault();
        this.setState({currentLocationTag: e.target.id});
    }

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
