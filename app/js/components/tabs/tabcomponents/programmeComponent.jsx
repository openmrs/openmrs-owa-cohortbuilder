import React from 'react';

const ProgrammeComponent = () => {
    return (
        <div className="programme-component">
            <h3>Search By Program Enrollement and Status</h3>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Program:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="" name="">
                            <option value="all">All</option>
                            <option value="male">Program 1</option>
                            <option value="female">Program 2</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Workflow:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="gender" name="gender">
                            <option value="all">All</option>
                            <option value="male">Workflow 1</option>
                            <option value="female">Workflow  2</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">State:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="gender" name="gender">
                            <option value="all">All</option>
                            <option value="male">State 1</option>
                            <option value="female">State 2</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Age</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">Between:</span>
                    </div>
                    <div className="col-sm-3">
                        <input  type="date" className="form-control" />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input type="date" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">In the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Enrolled in the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Completed in the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" />
                    </div>
                </div>
                
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" className="btn btn-success">Search</button>
                    </div>
                </div>
            </form>
            
            <h3>Search By Location</h3>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Patients belonging to?:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="" name="">
                            <option value="all">All</option>
                            <option value="male">Category 1</option>
                            <option value="female">Category 2</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">According to Method:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="" name="">
                            <option value="all">All</option>
                            <option value="male">Method 1</option>
                            <option value="female">Method 2</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" className="btn btn-success">Search</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ProgrammeComponent;