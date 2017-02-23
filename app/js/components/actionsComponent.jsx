import React, {Component} from 'react';

class ActionsComponent extends Component {
  render() {
    return (
      <div className="col-sm-12 section">
        <h3>Save Cohort</h3>

        <form className="form-horizontal">
          <div className="form-group">
            <label className="control-label col-sm-2" >Name:</label>
            <div className="col-sm-5">
              <input type="text" className="form-control" placeholder="Enter name" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2">Description:</label>
            <div className="col-sm-5">
              <input type="text" className="form-control" placeholder="Enter description" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-success">Save</button>
              <button className="btn btn-default cancelBtn">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ActionsComponent;
