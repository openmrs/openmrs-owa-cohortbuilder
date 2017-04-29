import React, { PropTypes, Component } from 'react';
import shortId from 'shortid';

const cohortTable = ({toDisplay, description}) => {
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
                                    <td>{patient.patient['person']['display']}</td>
                                    <td>{patient.patient['person']['age']}</td>
                                    <td>{patient.patient['person']['gender']}</td>
                                </tr>
                            );
                        })
                    } 
                </tbody> 
            </table>
        </div>
    );
};


cohortTable.propTypes = {
    toDisplay: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired
};

export default cohortTable;