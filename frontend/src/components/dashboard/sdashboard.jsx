import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./sdashboard.css";
import { toast } from "react-toastify";

const SDashboard = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState(null);
  const [placeBookings, setPlaceBookings] = useState([]);
  const [bookingData, setBookingData] = useState(false);
  const [bookPlace, setbookPlace] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState([]);
  const [viewStaffLocation, setViewStaffLocation] = useState(false);
  const [staffLocation, setStaffLocation] = useState([]);
  const [noStaffLocationAssigned, setNoStaffLocationAssigned] = useState(false);

  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    email: "",
    aadhar: "",
    startSlot: "",
    endSlot: "",
    phno: "",
    address: "",
    dob: "",
    placeId: "", // Initialize placeId as an empty string
    isExternal: true, // Always true for bookings from SDashboard
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setStaffData(response.data);
          console.log(response.data._id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/home", { replace: true });
      }
    };
    fetchData();
  }, [navigate]);
  
  // Fetch Logged in User Data
  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/staff/place",
          { withCredentials: true }
        );
        if (response.status === 200) {
          // setPlaceData(response.data);
          console.log(response.data); // Log the fetched place data for debugging
          // Update placeId in bookingFormData once placeData is fetched
          setBookingFormData((prevState) => ({
            ...prevState,
            placeId: response.data._id,
          }));
        }
      } catch (error) {
        console.error("Error fetching place data:", error);
        // Handle errors as needed, e.g., navigate to an error page or show an error message
      }
    };
    fetchPlaceData();
  }, []);

  // View all bookings
  const handleBookingData = async () => {
    try {
      const staffBookingsResponse = await axios.get(
        `http://localhost:8080/api/bookings/place/${staffData._id}`,
        { withCredentials: true }
      );
      if (staffBookingsResponse.status === 200) {
        const bookingsWithData = staffBookingsResponse.data.map(booking => {
          // Calculate payment amount for the current booking
          const paymentAmount = calculatePayment(booking);
          // Return booking data with payment amount
          return { ...booking, paymentAmount };
        });
        setPlaceBookings(bookingsWithData);
      } else {
        console.error(
          "Error fetching staff bookings:",
          staffBookingsResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching staff bookings:", error);
    }
  };

  // Get Location details assigned to the staff
  const getStaffLocation = async () => {
    try {
      const staffLocationResponse = await axios.get(
        `http://localhost:8080/api/places/${staffData._id}`,
        { withCredentials: true }
      );
      if (staffLocationResponse.status === 200) {
        setStaffLocation(staffLocationResponse.data);
      } else if (staffLocationResponse.status === 404) {
        setNoStaffLocationAssigned(true);
        console.error(
          "Error fetching staff location details:",
          staffLocationResponse.statusText
        );
      } else {
      setNoStaffLocationAssigned(true);
        console.error(
          "Error fetching staff location details:",
          staffLocationResponse.statusText
        );
      }
    } catch (error) {
      setNoStaffLocationAssigned(true);
      console.error("Error fetching staff bookings:", error);
    }
  };


  const handleBook = () => {
    setbookPlace(!bookPlace);
    setBookingData(false);
    setViewProfile(false);
    setBookingFormData({
      name: "",
      email: "",
      aadhar: "",
      startSlot: "",
      endSlot: "",
      phno: "",
      address: "",
      dob: "",
      placeId: "", // Initialize placeId as an empty string
      isExternal: true, // Always true for bookings from SDashboard
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setBookingFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? !prevState[name] : value,
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/bookings",
        bookingFormData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log("Booking successful");
        toast.success("Booking successful");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Error submitting booking");
      } else {
        toast.error("Error submitting booking");
      }
      console.error("Error submitting booking:", error);
    }
  };

  const handleViewProfile = () => {
    setViewProfile(!viewProfile);
    setbookPlace(false);
    setBookingData(false);
  };

  const handleViewLocation = () => {
    getStaffLocation();
    setViewStaffLocation(!viewStaffLocation);
  }

  const handleViewBookingData = () => {
    setBookingData(!bookingData);
    setbookPlace(false);
    setViewProfile(false);
    handleBookingData();
  };

    const [isDialogOpen, setIsDialogOpen] = useState(false);
  
    const handleCheckout = (booking) => {
      setSelectedBooking(booking); // Set selected booking for checkout
      openDialog(booking); // Open dialog with pre-calculated payment amount
    };
  
    const calculatePaymentAndOpenDialog = (selectedBooking) => {
      if (selectedBooking) {
        // Calculate payment amount for selected booking
        const payment = calculatePayment(selectedBooking);
        // Open the dialog with the calculated payment amount
        openDialog(payment);
      } else {
        console.error("No booking found.");
      }
    };

    const openDialog = (booking) => {
      setIsDialogOpen(true);
    
      setPaymentAmounts((prevPaymentAmounts) => ({
        ...prevPaymentAmounts,
        [booking._id]: booking.paymentAmount,
      }));
    };
  
    const closeDialog = () => {
      setIsDialogOpen(false);
      setSelectedBooking(null); // Clear selected booking after closing dialog
    };

    function calculatePayment(selectedBooking) {
      const checkInDate = new Date(selectedBooking.startSlot);
      const checkOutDate = new Date(selectedBooking.endSlot);
      const differenceInDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
      if (differenceInDays <= 3) {
        return 0;
      } else {
        const daysAfterFreePeriod = differenceInDays - 3;
        const dailyCharge = 50; // Assuming 50 is the daily charge after the free period
        const finalAmount = daysAfterFreePeriod * dailyCharge;
        return finalAmount;
      }
    }

  
    const MenuCards = () => {
      return (
        <div className="sdashboard__page">
          <div class="notification" onClick={handleViewBookingData}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">View Bookings</div>
            <div class="notibody">View all details of User's Bookings in your Location</div>
          </div>
          <div class="notification" onClick={handleBook}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">Book a slot</div>
            <div class="notibody">Book a slot for the customer on their behalf</div>
          </div>
          <div class="notification" onClick={handleViewLocation}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">View your Location</div>
            <div class="notibody">Details of location assigned to you </div>
          </div>
          <div class="notification" onClick={handleViewProfile}>
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">My Profile</div>
            <div class="notibody">View/Edit my Profile</div>
          </div>
        </div> 
      );
    };
    
    

    const BookingData = () => {
      return (

        <div>
          <h3 className="Table_Heading">Bookings under your Location</h3>
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
                  <th>Check In</th>
                  <th>Check Out</th>
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
                    <td><button>check in</button></td>
                    <td>
                      <button onClick={() => handleCheckout(booking)}>Checkout</button>
                      {/* {booking.paymentAmount && <span>Payment Amount: {booking.paymentAmount}</span>} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    const ViewStaffLocation = () => {
      console.log("noStaffLocationAssigned: "+ noStaffLocationAssigned)
      if(noStaffLocationAssigned){
        return (
        <div>
          <h3 className="Table_Heading" >No Location Assigned to you</h3>
        </div>
        )
      } else {
      return (
        <div>
        <h3 className="Table_Heading">Location Assigned to you</h3>
        
        {/* <div className="card-body">
          <div>
            <figure>
              <img src={staffLocation.Image} alt={staffLocation.name} />
            </figure>
            <h2 className="card-title">{staffLocation.name}</h2>
            <p className="dash">Location: {staffLocation.location}</p>
            <p className="dash">Contact: {staffLocation.contact}</p>
            <p className="dash">Slots: {staffLocation.slot}</p>
          </div>
        </div> */}
        <div class="cardd">
    <div class="align">
        <span class="red"></span>
        <span class="yellow"></span>
        <span class="green"></span>
    </div>
    <div>
    <h1>Location: {staffLocation.location}</h1>
              <img src={staffLocation.Image} alt={staffLocation.name} />
            <figure>
            </figure>
            {/* <h2 className="card-title">{staffLocation.name}</h2> */}
            {/* <p className="dash"></p> */}
            <p className="dash">Contact: {staffLocation.contact}</p>
            <p className="dash">Slots: {staffLocation.slot}</p>
          </div>
  
</div>
      </div>
      );
      }
    };


  const ViewProfile = () => {
    return (
      <div>
        {staffData && (
          <div id="cd" className="card-outer-container">
            <div className="card-container">
              <h2>{staffData.name}</h2>
              <h4 id="em">Role : {staffData.userType}</h4>
              <div className="imp-data">
                <p>email : {staffData.email}
                </p>
                {/* <p>Phone : {staffData.phone}</p> */}
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
      <MenuCards/>
    </div>
    {bookingData && (<BookingData/>)}
    {isDialogOpen && selectedBooking && (
      <div className="overlay" id="over">
        <div className="dialog">
          <h1>Payment</h1>
          <p id="sd">Your payment is {paymentAmounts[selectedBooking._id]}</p>
          <button onClick={closeDialog}>Yes</button>
          <button onClick={closeDialog}>Cancel</button>
        </div>
      </div>
    )}
     {bookPlace && (
      <div id="formm">
      <h3 id="place">Book a Slot</h3>
      <form onSubmit={handleSubmitBooking}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={bookingFormData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={bookingFormData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="aadhar"
          placeholder="Aadhar"
          value={bookingFormData.aadhar}
          onChange={handleInputChange}
          required
        />
        <input
          type="datetime-local"
          name="startSlot"
          value={bookingFormData.startSlot}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="endSlot"
          value={bookingFormData.endSlot}
          onChange={handleInputChange}
        />
        <input
          type="tel"
          name="phno"
          placeholder="Phone Number"
          value={bookingFormData.phno}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={bookingFormData.address}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={bookingFormData.dob}
          onChange={handleInputChange}
        />
        <button type="submit">Book Slot</button>
      </form>
    </div>
  )}
    {viewStaffLocation && (<ViewStaffLocation />)}
    {viewProfile && (<ViewProfile/>)}
</>
);
};

export default SDashboard;
