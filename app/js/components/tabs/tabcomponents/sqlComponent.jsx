import React from 'react';

const SqlComponent = React.createClass({
    render: function(){
        return (
            <div className="content sql-component">
                <textarea name="query" id="" cols="30" rows="10"></textarea>
                <div className="button-div">
                    <button className="btn btn-success">Search</button>
                </div>
                <h2 className="query-warning">
                    <b>Important:</b> Please test your SQL queries in your favourite editor before using them here.
                </h2>
            </div>
        );
    }
});

export default SqlComponent;