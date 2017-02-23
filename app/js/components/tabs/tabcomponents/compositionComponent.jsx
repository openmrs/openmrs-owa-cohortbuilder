import React from 'react';

const CompositionComponent = React.createClass({
    componentDidMount(){},
    render: function(){
        return (
            <div id="compositions-wrapper">
                <div className="compositionsTitle">
                <h3>Boolean Search</h3>
                </div>
                <p>Enter a search query and click search button below to execute:</p>
                <i>e.g: "(1 and 2) or not"<br/>
                    Query parameters supported are: AND, OR, NOT, UNION, INTERSECTION, !, +
                </i> <br/>
                <form className="form-horizontal col-md">
                <div className="form-group">
                    <div className="col-sm-12">
                    <input id="composition-search-query" type="text" className="form-control" placeholder="Enter search query. . ." />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm col-sm-10">
                    <button type="submit" className="btn btn-success">Search</button>
                    </div>
                </div>
                </form>
            </div>
        );
    }
});

export default CompositionComponent;