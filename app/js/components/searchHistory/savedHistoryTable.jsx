import React, { PropTypes, Component } from 'react';
import shortId from 'shortid';

const savedHistoryTable = ({toDisplay, description}) => {
    return (
        <div>
            <h1 className="text-center">{description}</h1>
            <table className="table table-striped" >
                <thead>
                    <tr>
                        <td>NAME</td>
                        <td>AGE</td>
                        <td>GENDER</td>
                    </tr>
                </thead>
                <tbody>
                    {   toDisplay.map((patient) => {
                            return (
                                <tr key={shortId.generate()}>
                                    <td>{patient.firstname +" "+patient.lastname}</td>
                                    <td>{patient.age}</td>
                                    <td>{patient.gender}</td>
                                </tr>
                            );
                        })
                    } 
                </tbody> 
            </table>
        </div>
    );
};


savedHistoryTable.propTypes = {
    toDisplay: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired
};

export default savedHistoryTable;