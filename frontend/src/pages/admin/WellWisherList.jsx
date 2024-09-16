import React from 'react'
import AdminSideBar from '../../components/AdminSideBar'

const WellWisherList = () => {
  return (
    <div>
      <div>
      <br/><br/><br/><br/><br/>
    <div className='container-fluid bg-secondary min-vh-100'>
      <div className='row'>
        <div className='col-2 bg-white vh-100'>
          <AdminSideBar />
        </div>
        
        <div className='col'>
          <div className="mt-2">
            <h4 className="text-white">List Of Well Wishers</h4>
            <table className="table table-striped table-hover table-bordered text-white">
              <thead className="bg-white text-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Country</th>
                  <th scope="col">Verified</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td>USA</td>
                  <td>Yes</td>
                  <td>
                    <button type="button" className="btn btn-danger">Ban</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>Canada</td>
                  <td>No</td>
                  <td>
                    <button type="button" className="btn btn-danger">Ban</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div></div>
    </div>
    </div>
  )
}

export default WellWisherList
