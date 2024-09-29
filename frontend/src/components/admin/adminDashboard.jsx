import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


import "./adminDashboard.css";

const AdminDashboard = ({ setAuthenticated }) => {
  
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [placeBookings, setPlaceBookings] = useState([]);
  const [staffDropdown, setStaffDropdown] = useState([]);
  const [bookingData, setBookingData] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [viewAllUsers, setViewAllUsers] = useState(false);
  const [addNewStaff, setAddNewStaff] = useState(false); const [selectedTab, setSelectedTab] = useState("Users");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [newStaffFormData, setNewStaffFormData] = useState({
    name: "",
    email: "",
    password: "password"
  });
  const [viewAddNewPlaceForm, setViewAddNewPlaceForm] = useState(false);
  const [addNewPlaceFormData, setAddNewPlaceFormData] = useState({
    name: "",
    staff: "",
    location: "",
    contact: "",
    image: ""
  });

  // Fetch Logged in User Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setAdminData(response.data);
        }
      } catch (error) {
        console.error("Fetch user data error:", error);
        navigate("/home", { replace: true });
      }
    };
    fetchData();
  }, [navigate]);

  // View all bookings for Admin {router in routeUpload.js} --remove comments
  const handleBookingData = async () => {
    try {
      const allBookingsDetails = await axios.get(
        `http://localhost:8080/api/viewfullbooking`,
        { withCredentials: true }
      );
      if (allBookingsDetails.status === 200) {
        setPlaceBookings(allBookingsDetails.data);
        setBookingData(!bookingData);
        setViewProfile(false);
        setViewAllUsers(false);
        setAddNewStaff(false);
        setViewAddNewPlaceForm(false);
      } else {
        console.error(
          "Error fetching details of all bookings:",
          allBookingsDetails.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching staff bookings:", error);
    }
  };

  const handleViewAllUsers = () => {
    handleGetAllUsers();
    setViewAllUsers(!viewAllUsers);
    setBookingData(false);
    setViewProfile(false);
    setAddNewStaff(false);
    setViewAddNewPlaceForm(false);
  }

  const handleGetAllUsers = async () => {
    try {
      const allRegisteredUsers = await axios.get(
        `http://localhost:8080/api/viewfulluser`,
        { withCredentials: true }
      );
      if (allRegisteredUsers.status === 200) {
        setRegisteredUsers(allRegisteredUsers.data);
      } else {
        console.error(
          "Error fetching details of all users:",
          allRegisteredUsers.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching details of all users:", error);
    }
  };

  // Handle Deletion of Staffs
  const handleStaffDeletion = async (id,name) => {
    try {
      const staffDeletionResponse = await axios.delete(
        `http://localhost:8080/api/delete/staff/${id}`,
        { withCredentials: true }
      );
      if (staffDeletionResponse.status === 200) {
        toast.success('Staff Deleted successful');
        handleViewAllUsers();
        handleTabChange("Staffs");
      } else {
        console.error("Error while deleting staff :" + name);
        toast.error("Error while deleting staff :");
      }
    } catch (error) {
      toast.error("Error while deleting staff: ");
      console.error("Error while deleting staff :", error);
    }
  };

  // Handle new staff addition form
  const handleNewStaffAdditionForm = () => {
    setAddNewStaff(!addNewStaff);
    setViewProfile(false);
    setBookingData(false);
    setViewAllUsers(false);
    setViewAddNewPlaceForm(false);
    setNewStaffFormData({
      name: "",
      email: "",
      password: "password"
    });
  }

  // Handle new staff addition
const handleNewStaffAddition = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      'http://localhost:8080/api/create/staff',
      newStaffFormData,
      { withCredentials: true }
    );
    toast.success('New Staff added successfully');
    setNewStaffFormData({
      name: "",
      email: "",
      password: "password"
    });
    setAddNewStaff(false);
  } catch (error) {
    toast.error(error.response.data);
  }
};

// Handle new place addition form
const handleNewPlaceAdditionForm = async () => {
  handleGetAllUsers();
  setStaffDropdown(registeredUsers.filter(user =>
    user.userType === "staff"
  ));
  setViewProfile(false);
  setBookingData(false);
  setViewAllUsers(false);
  setAddNewStaff(false);
  setViewAddNewPlaceForm(!viewAddNewPlaceForm);
  setAddNewPlaceFormData({
    name: "",
    staff: "",
    location: "",
    contact: "",
    image: ""
  });
}

const handleAddNewPlace = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('name', addNewPlaceFormData.name);
    formData.append('staff', addNewPlaceFormData.staff);
    formData.append('location', addNewPlaceFormData.location);
    formData.append('contact', addNewPlaceFormData.contact);
    formData.append('imageFile', addNewPlaceFormData.image);

    console.log(addNewPlaceFormData)
    const response = await axios.post(
      'http://localhost:8080/api/upload',
      formData,
      { withCredentials: true }
    );
    toast.success('New Place added successfully');
    // Reset form to default state
    setAddNewPlaceFormData({
      name: "",
      staff: "",
      location: "",
      contact: "",
      image: ""
    });
    setViewAddNewPlaceForm(false);
  } catch (error) {
    toast.error(error.response.data);
  }
};


  const handleViewProfile = () => {
    setViewProfile(!viewProfile);
    setBookingData(false);
    setViewAllUsers(false);
    setAddNewStaff(false);
    setViewAddNewPlaceForm(false);
  };

    const handleInputChangeNewStaffFormData = (e) => {
      const { name, value } = e.target;
      setNewStaffFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleInputChangeNewPlaceFormData = (e) => {
      const { name, value } = e.target;
      setAddNewPlaceFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setAddNewPlaceFormData((prevState) => ({
        ...prevState,
        image: file,
      }));
    };
  
    const MainComponent = () => {
      return (
        <div className="admin__page">
          <div class="notification" onClick={handleBookingData}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">View Bookings</div>
            <div class="notibody">View all details of existing Bookings</div>
         </div>
          <div class="notification" onClick={handleViewAllUsers}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">View All Users</div>
            <div class="notibody">View details of Users / Staffs / Admins</div>
         </div>
         <div class="notification" onClick={handleNewPlaceAdditionForm}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">Add New Place</div>
            <div class="notibody">Add a new Location</div>
         </div>
         <div class="notification" onClick={handleNewStaffAdditionForm}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">Add New Staff</div>
            <div class="notibody">Add a New Staff to a Location</div>
         </div>
         <div class="notification" onClick={handleViewProfile}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">My Profile</div>
            <div class="notibody">View/Edit My Profile</div>
         </div>
        </div>  
      );
    };

    const BookingData = () => {
      return (
        <div className="overflow-x-auto">
          <table className="table_data">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Aadhar</th>
                <th>Start Slot</th>
                <th>End Slot</th>
                <th>Phone Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {placeBookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.aadhar}</td>
                  <td>{new Date(booking.startSlot).toLocaleString()}</td>
                  <td>{new Date(booking.endSlot).toLocaleString()}</td>
                  <td>{booking.phno}</td>
                  <td>{booking.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    
   
    const handleTabChange = (tab) => {
      setSelectedTab(tab);
    };

    const filteredUsers = registeredUsers.filter(user =>
      selectedTab === "Users" ? user.userType === "user" :
      selectedTab === "Staffs" ? user.userType === "staff" :
      selectedTab === "Admin" ? user.userType === "admin" :
      true
    );

    const ViewAllUsers =() => {
      return (
      <div>
        <div className="tablist">
          <input type="radio" name="my_tabs_1" className="tab" id="users" aria-label="Users"
            checked={selectedTab === "Users"} onChange={() => handleTabChange("Users")} />
          <label htmlFor="users">Users</label>

          <input type="radio" name="my_tabs_1" className="tab" id="staffs" aria-label="Staffs"
            checked={selectedTab === "Staffs"} onChange={() => handleTabChange("Staffs")} />
          <label htmlFor="staffs">Staffs</label>

          <input type="radio" name="my_tabs_1" className="tab" id="admins" aria-label="Admins"
            checked={selectedTab === "Admin"} onChange={() => handleTabChange("Admin")} />
          <label htmlFor="admins">Admins</label>
        </div>

           <div className="tab-content p-10">
            {selectedTab === "Users" && (
            <div>
              <h3 className="Table_Heading">User Details</h3>
                <div className="overflow-x-auto">
                  <table className="table_data">
                      <thead>
                        <tr>
                          <th>User Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th><>Delete User</></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((users, index) => (
                          <tr key={index}>
                            <td>{users.name}</td>
                            <td>{users.email}</td>
                            <td>{users.userType}</td>
                            <td><button onClick={() => handleStaffDeletion(users._id,users.name)} class="delete-button"><svg class="delete-svgIcon" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button></td>
                          </tr>
                        ))}
                      </tbody>
                </table>
              </div>
            </div>
            )}
         
         {selectedTab === "Staffs" && (
          <div>
             <h3 className="Table_Heading">Staffs Details</h3>
              <div className="overflow-x-auto">
              <table className="table_data">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th><>Delete Staff</></th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredUsers.map((users, index) => (
                        <tr key={index}>
                          <td>{users.name}</td>
                          <td>{users.email}</td>
                          <td>{users.userType}</td>
                          <td><button onClick={() => handleStaffDeletion(users._id,users.name)} class="delete-button"><svg class="delete-svgIcon" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button></td>
                        </tr>
                      ))}
                    </tbody>
              </table>
            </div>
          </div>
         )}
        
        {selectedTab === "Admin" && (
          <div>
             <h3 className="Table_Heading">Admin Details</h3>
              <div className="overflow-x-auto">
              <table className="table_data">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredUsers.map((users, index) => (
                        <tr key={index}>
                          <td>{users.name}</td>
                          <td>{users.email}</td>
                          <td>{users.userType}</td>
                        </tr>
                      ))}
                    </tbody>
              </table>
            </div>
          </div>
        )}
       </div>
      </div>
      );
    };

    const ViewProfile = () => {
      return (
        <div>
          {adminData && (
            <div id="cd" className="card-outer-container">
              <div className="card-container">
                <h2>{adminData.name}</h2>
                <h4 id="em">Role : {adminData.userType}</h4>
                <div className="imp-data">
                  <p>email : {adminData.email}
                  </p>
                  {/* <p>Phone : {adminData.phone}</p> */}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

  

  return (
    <>
    <br/>
    <div>
    <MainComponent/>
    </div>
    
    {bookingData && (<BookingData/>)}
    {viewAllUsers && (<ViewAllUsers/>)}
    {viewProfile && (<ViewProfile/>)}

    {addNewStaff && (
      <div className="login-container">
      <h3 id="Table_Heading">Add New Staff Details</h3>
      <form onSubmit={handleNewStaffAddition} id="loggg">
      <div className="input-group-admin">
      <input
           type="text"
           name="name"
           placeholder="Name"
           value={newStaffFormData.name}
           onChange={handleInputChangeNewStaffFormData}
           required
         />       
     </div>
        {/* <div className="input-group-admin">
          <select name="staff" value={addNewPlaceFormData.staff} onChange={handleInputChangeNewPlaceFormData} required>
            <option value="">Select Staff</option>
            {staffDropdown.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div> */}
        <div className="input-group-admin">
        <input
           type="email"
           name="email"
           placeholder="Email"
           value={newStaffFormData.email}
           onChange={handleInputChangeNewStaffFormData}
         />    
        </div>
        {/* <div className="input-group-admin">
          <input type="text" name="contact" placeholder="Contact" value={addNewPlaceFormData.contact} onChange={handleInputChangeNewPlaceFormData} />
        </div>
        <div className="input-group-admin">
          <input type="file" name="image" placeholder="Image Upload" onChange={handleImageChange} />
        </div> */}
        <button type="submit">Add Staff</button>
  </form>
    </div>
  //    <div>
  //    <h3>Add New Staff Details</h3>
  //    <form onSubmit={handleNewStaffAddition}>
  //      <div>
  //        <input
  //          type="text"
  //          name="name"
  //          placeholder="Name"
  //          value={newStaffFormData.name}
  //          onChange={handleInputChangeNewStaffFormData}
  //          required
  //        />
  //      </div>
  //      <div>
  //        <input
  //          type="email"
  //          name="email"
  //          placeholder="Email"
  //          value={newStaffFormData.email}
  //          onChange={handleInputChangeNewStaffFormData}
  //        />
  //      </div>
  //      <button type="submit">Add Staff</button>
  //    </form>
  //  </div>
    )}

    {viewAddNewPlaceForm && (
    <div className="login-container">
    <h3 id="Table_Heading">Add New Place Details</h3>
    <form onSubmit={handleAddNewPlace} className="login-form login-box" id="logg">
      <div className="input-group-admin">
        <input type="text" name="name" placeholder="Name" value={addNewPlaceFormData.name} onChange={handleInputChangeNewPlaceFormData} required />
      </div>
      <div className="input-group-admin">
        <select name="staff" value={addNewPlaceFormData.staff} onChange={handleInputChangeNewPlaceFormData} required>
          <option value="">Select Staff</option>
          {staffDropdown.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>
      <div className="input-group-admin">
        <input type="text" name="location" placeholder="Location" value={addNewPlaceFormData.location} onChange={handleInputChangeNewPlaceFormData} />
      </div>
      <div className="input-group-admin">
        <input type="text" name="contact" placeholder="Contact" value={addNewPlaceFormData.contact} onChange={handleInputChangeNewPlaceFormData} />
      </div>
      <div className="input-group-admin">
        <input type="file" name="image" placeholder="Image Upload" onChange={handleImageChange} />
      </div>
      <button type="submit">Add Place</button>
    </form>
  </div>
    )}

    </>
  );
};

export default AdminDashboard;