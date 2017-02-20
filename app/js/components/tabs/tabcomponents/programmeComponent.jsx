import React from 'react';

const ProgrammeComponent = React.createClass({
    render: function(){
        return (
            <div>
              <div className="actionsTitle">
                <h4 className="actionsText">Search by encounter:</h4>
              </div>

              <div>
                <h3 className="text-center">Patients having encounters</h3>
                <form className="form-horizontal text-center">
                  <div className="form-group">
                    <label htmlFor="type" className="col-sm-2 control-label">
                      Of Type
                    </label>
                    <div className="col-sm-6">
                      <select multiple="multiple" name="type" id="type" className="form-control">
                        <option value="Admission">Admission</option>
                        <option value="Checkin">Checkin</option>
                        <option value="Checkout">Checkout</option>
                        <option value="Discharge">Discharge</option>
                        <option value="Paged Numeric vital test form">Paged Numeric vital test form</option>
                        <option value="Vital">Vitals</option>
                        <option value="Vital">Transfer</option>
                        <option value="Vital">Visit Noter</option>
                      </select>
                    </div>
                    <span className="inline-label">(Leave blank for all encounter types)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location" className="col-sm-2 control-label">At Location</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="location">
                            <option value="">Select option</option>
                            <option value="">Location</option>
                            <option value="">Location 2</option>
                        </select>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form" className="col-sm-2 control-label">From Form</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="form">
                            <option value="">Select option</option>
                            <option value="">Form</option>
                            <option value="">Form 2</option>
                        </select>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="atLeast" className="col-sm-2 control-label">Atleast this many: </label>
                    <div className="col-sm-3">
                        <select className="form-control" id="atLeast">
                            <option value="">0</option>
                            <option value="">1</option>
                            <option value="">2</option>
                        </select>
                    </div>
                    <label htmlFor="atMost" className="col-sm-2 control-label">Upto this many: </label>
                    <div className="col-sm-3">
                        <select className="form-control" id="atMost">
                            <option value="">100</option>
                            <option value="">150</option>
                            <option value="">200</option>
                        </select>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="atLeast" className="col-sm-2 control-label">Within the last: </label>
                    <div className="col-sm-3">
                        <select className="form-control" id="atLeast">
                            <option value="">0</option>
                            <option value="">1</option>
                            <option value="">2</option>
                        </select>
                    </div>
                    <label htmlFor="atMost" className="col-sm-2 control-label">month(s) and : </label>
                    <div className="col-sm-3">
                        <select className="form-control" id="atMost">
                            <option value="">3</option>
                            <option value="">6</option>
                            <option value="">12</option>
                        </select>
                    </div>
                    <span className="inline-label">days    (Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="since" className="col-sm-2 control-label">Since: </label>
                    <div className="col-sm-3">
                        <select className="form-control" id="since">
                            <option value="">0</option>
                            <option value="">1</option>
                            <option value="">2</option>
                        </select>
                    </div>
                    <label htmlFor="until" className="col-sm-2 control-label">Until: </label>
                    <div className="col-sm-3">
                        <select className="form-control" id="until">
                            <option value="">100</option>
                            <option value="">150</option>
                            <option value="">200</option>
                        </select>
                    </div>
                    <span className="inline-label">day(s)    (Optional)</span>
                  </div>

                  <div className="form-group">
                    <div className="col-sm-10">
                      <button type="submit" className="btn btn-success">Search</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
        );
    }
});

export default ProgrammeComponent;
