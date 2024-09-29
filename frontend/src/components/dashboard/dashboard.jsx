import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Make sure to import CSS for DatePicker
import { toast } from "react-toastify";
import axios from "axios";

import "./dashboard.css";


const Dashboard = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPlaces, setShowPlaces] = useState(false);
  //const [usrDisplay, setUsrDisplay] = useState(true);
  const [showUsrBooking, setShowUsrBooking] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [phno, setPhno] = useState("");
  const [address, setAddress] = useState("");
  const [viewProfile, setViewProfile] = useState(false); // State to track whether to view profile or not
  const [aadhar, setAadhar] = useState(""); // State to store aadhar number
  const [name, setName] = useState(""); // State to store name
  const [email, setEmail] = useState(""); // State to store email
  const [dob, setDob] = useState(null); // State to store date of birth

  // Fetch user data when token changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Fetch user data error:", error);
        navigate("/home", { replace: true });
      }
    };
    fetchData();
  }, [navigate]);

  const fetchAvailablePlaces = () => {
    setShowPlaces(!showPlaces);
    setShowBookingForm(false);
  }

  useEffect(() => {
    const fetchPlacesData = async () => {
      try {
        const placesResponse = await fetch("http://localhost:8080/api/places", {
          method: "GET",
          credentials: "include",
        });
        if (placesResponse.ok) {
          const placesData = await placesResponse.json();
          setPlaces(placesData);
        } else {
          console.error("Error fetching places:", placesResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
    fetchPlacesData();
  }, []); // Fetch place data when token changes

  const handleBooking = (place) => {
    setShowBookingForm(!showBookingForm);
    setShowPlaces(false);
    //setUsrDisplay(false);
    setShowUsrBooking(false);
    setSelectedPlace(place); // Set the selected place
  };
  
  const submitBooking = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        placeId: selectedPlace._id,
        name,
        email,
        dob,
        aadhar,
        phno,
        address,
        startSlot: startDate,
        endSlot: endDate,
        isExternal: false,
      }),
      credentials: "include",
    });

    
    const data = await response.json();
    if (response.ok) {
      toast.success("Booking successful, check my bookings to view");
      console.log("Booking successful:", data);
      setUserBookings([...userBookings, data]);
      setShowBookingForm(false);
      setShowPlaces(false); // Hide the booking form after successful booking
      setShowUsrBooking(false);
      setStartDate(new Date());
      setEndDate(new Date());
      setPhno("");
      setAddress("");
      setName("");
      setEmail("");
      setDob(null);
    } else {
      toast.error(data.message);
      console.error("Error booking:", data);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cancel/ticket/${bookingId}`, {
        method: "PUT",
        credentials: "include",
      });
  
      if (response.ok) {
        const updatedUserBookings = userBookings.filter(
          (booking) => booking._id !== bookingId
        );
        setUserBookings(updatedUserBookings);
        toast.success("Booking cancelled successfully");
      } else {
        const data = await response.json();
        toast.error(data.message);
        console.error("Error cancelling booking:", data);
      }
    } catch (error) {
      toast.error("Error cancelling booking");
      console.error("Error cancelling booking:", error);
    }
  }

  const fetchUserBookings = async () => {
    if (!user) return;
    try {
      const userBookingsResponse = await fetch(
        "http://localhost:8080/api/bookings/user",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (userBookingsResponse.ok) {
        const userBookingsData = await userBookingsResponse.json();

        if (userBookingsData.length === 0) {
          // No bookings available
          toast.error("No bookings available for this user.");
          setShowPlaces(false); // Show the places
          setShowBookingForm(false); // Hide the booking form
          setShowUsrBooking(false); // Hide the user bookings
          setViewProfile(false);
        } 
          else {
             // Bookings available
             // Filter upcoming and previous bookings based on the current present date
             const currentDate = new Date();
             const upcomingBookings = userBookingsData.filter(
               (booking) => new Date(booking.startSlot) > currentDate
             );
             const previousBookings = userBookingsData.filter(
               (booking) => new Date(booking.endSlot) < currentDate
             );
         
          // Bookings available
          console.log("User bookings:", userBookingsData);
          setUserBookings(userBookingsData);
          setShowPlaces(false); // Hide the places
          setShowBookingForm(false); // Hide the booking form
          setShowUsrBooking(true); // Show the user bookings
          setViewProfile(false);
        }
      }
      else {
        console.error(
          "Error fetching user bookings:",
          userBookingsResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    }
  };


  const handleViewProfile = () => {
    setViewProfile(!viewProfile);
    setShowBookingForm(false);
    setShowPlaces(false);
    setShowUsrBooking(false);
  };

  const handleViewBookings = () => {
    setShowUsrBooking(!showUsrBooking);
    fetchUserBookings();
  };

  const MenuCards = () => {
    return (
      <div className="sdashboard__page">
        <div class="notification" onClick={fetchAvailablePlaces}>
          <div class="notiglow"></div>
          <div class="notiborderglow"></div>
          <div class="notititle">Book a Slot</div>
          <div class="notibody">View and Book a slot</div>
        </div>
        <div class="notification" onClick={handleViewBookings}>
          <div class="notiglow"></div>
          <div class="notiborderglow"></div>
          <div class="notititle">View Bookings</div>
          <div class="notibody">View your full booking history</div>
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

  const UserBookings = () => {
    return (
      <div>
        <div role="tablist" className="tabs tabs-bordered" >
        <input type="radio" name="my_tabs_1" role="tab" className="tab" id="ad" aria-label="Upcoming" checked />
          <div role="tabpanel" className="tab-content p-10">
            <h3 id="books" className="aga">Booking Details</h3>
              <div className="card-body">
              <ul className="books-list">
              {showUsrBooking && userBookings && (
  <div>
    <div role="tablist" className="tabs tabs-bordered">
      {/* Upcoming Bookings */}
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        id="upcoming"
        aria-label="Upcoming"
        checked
      />
      <div role="tabpanel" className="tab-content p-10" >
        <h3 id="upcoming-bookings" className="aga">
          Upcoming Bookings
        </h3>
        <div className="card-body">
          <div id="up">

          <ul className="books-list">
            {userBookings &&
              userBookings
                .filter(
                  (booking) => new Date(booking.startSlot) > new Date() && booking.ticketStatus !== 'Cancelled'

                )
                .map((booking) => (
                  <li key={booking._id}>
                       <div className="mywid">
                                <h2 className="card-title"><p>Place : {booking.placeId.name}</p></h2>
                                <p>Place : {booking.placeId.name}</p>
                                <p>Booking ID : {booking.bookingId}</p>
                                <p>Your Name : {booking.name}</p>
                                <p>Email : {booking.email}</p>
                                <p>Aadhar : {booking.aadhar}</p>
                                <p>Start Slot : {new Date(booking.startSlot).toLocaleString()}</p>
                                <p>End Slot : {new Date(booking.endSlot).toLocaleString()}</p>
                                <p>Phone Number : {booking.phno}</p>
                                <p>Address : {booking.address}</p>
                                <button onClick={() => handleCancelBooking(booking.bookingId)}>
                                  {console.log(booking.bookingId)}
                                    Cancel Booking
                                  </button>
                               
                              </div>
                  </li>
                ))}
          </ul>
        </div>
      </div>
      </div>
      {/* Previous Bookings */}
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        id="previous"
        aria-label="Previous"
      />
      <div role="tabpanel" className="tab-content p-10">
        <h3 id="previous-bookings" className="aga">
          Previous Bookings
        </h3>
        <div className="card-body" id="pre">
          <ul className="books-list">
            {userBookings &&
              userBookings
                .filter(
                  (booking) => new Date(booking.endSlot) < new Date()
                )
                .map((booking) => (
                  <li key={booking._id}>
                                <div className="mywid">
                                <h2 className="card-title"><p>Place : {booking.placeId.name}</p></h2>
                                <p>Place : {booking.placeId.name}</p>
                                <p>Booking ID : {booking.bookingId}</p>
                                <p>Your Name : {booking.name}</p>
                                <p>Email : {booking.email}</p>
                                <p>Aadhar : {booking.aadhar}</p>
                                <p>Start Slot : {new Date(booking.startSlot).toLocaleString()}</p>
                                <p>End Slot : {new Date(booking.endSlot).toLocaleString()}</p>
                                <p>Phone Number : {booking.phno}</p>
                                <p>Address : {booking.address}</p>
                                <div className="card-actions justify-end">
                                  
                                </div>
                              </div>                  
                              </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
)}



              </ul>
            </div>
          </div>
        <input type="radio" name="my_tabs_1" role="tab" className="tab" id="add" aria-label="Previous" />
          <div role="tabpanel" className="tab-content p-10">
          </div>
      </div>
    </div>
    );
  };

  const ShowPlaces = () => {
    return (
      <div>
      <h3 id="place">Available Places</h3>
      <div className="card-body">
        <ul className="places-list">
          {showPlaces &&
            places.map((place) => (
              <li key={place._id}>
                <div>
                  <figure>
                    <img src={place.Image} alt={place.name} />
                  </figure>
                  <h2 className="card-title">{place.name}</h2>
                  <p className="dash">Location: {place.location}</p>
                  <p className="dash">Contact: {place.contact}</p>
                  <p className="dash">Slots: {place.slot}</p>
                  {/* <div className="card-actions justify-end"> */}
                  <button onClick={() => handleBooking(place)}>
                    Book Now
                  </button>
                  {/* </div> */}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
    );
  };

  const ViewProfile = () => {
    return (
      <div>
        {user && (
           <div>
           {/* Render user details here */}
           
          
             <div id="cd" className="card-outer-container">
               <div className="card-container">
                 <span className="edit-symbol">
                   <i className="fas fa-edit"></i>
                 </span>
                 <h2>Welcome, {user.name}</h2>
                 <h4 id="em">Email : {user.email}</h4>
                 {/* <p id="emm">Female, 20 years</p> */}
 
                 <div className="imp-data">
                   <p>
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 576 512"
                       className="icon-style"
                     >
                       <path d="M0 96l576 0c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96zm0 32V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128H0zM64 405.3c0-29.5 23.9-53.3 53.3-53.3H234.7c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7H74.7c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16z" />
                     </svg>
                     Aadhar number {user.aadhar}
                   </p>
                 
                 </div>
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

    {showPlaces && (<ShowPlaces/>)}
    
    {showUsrBooking && userBookings && (<UserBookings/>)}
    
    {showBookingForm && (
      
      
      <div class="login-box" id="df">
        <h2 id="headd">Booking Form</h2>
 
 <form onSubmit={submitBooking} id="df">
   {/* <div class="user-box">
     <input type="text" name="" required=""/>
     <label>Username</label>
     </div> */}
   <div class="user-box">
   <input
              type="email"
              placeholder="Email"
              value={email} // Use email state if available, otherwise use user.email
              onChange={(e) => setEmail(e.target.value)}
            />
            <br/>   
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />
            <input
              type="text"
              placeholder="Aadhar"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              required
            />
            <br />
            {/* Remaining form fields */}
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              placeholderText="Select Date of Birth"
              dateFormat={"dd/MM/yyyy"}
              required
            />
            <br />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              dateFormat={"dd/MM/yyyy"}
              placeholderText="Select start date"
            />
            <br />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat={"dd/MM/yyyy"}
              placeholderText="Select end date"
            />
            <br />
            <input
              type="number"
              placeholder="Phone Number"
              value={phno}
              onChange={(e) => setPhno(e.target.value)}
              required
            />
            <br />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            
            
              {/* <label>Password</label> */}
   </div><center>
   <a href="#">
   <button type="submit" id="rt">Confirm Booking</button>
   <span></span>
   </a></center>
 </form>
</div>
  //  <div>
  //     <form onSubmit={submitBooking} id="df">
  //       <div class="login-boxx">
  //         <div class="user-box">
  //           <input
  //             type="email"
  //             placeholder="Email"
  //             value={email} // Use email state if available, otherwise use user.email
  //             onChange={(e) => setEmail(e.target.value)}
  //           />
  //           <br />
  //           {/* Render name and aadhar as unmodifiable */}
  //           <input
  //             type="text"
  //             placeholder="Name"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             required
  //           />
  //           <br />
  //           <input
  //             type="text"
  //             placeholder="Aadhar"
  //             value={aadhar}
  //             onChange={(e) => setAadhar(e.target.value)}
  //             required
  //           />
  //           <br />
  //           {/* Remaining form fields */}
  //           <DatePicker
  //             selected={dob}
  //             onChange={(date) => setDob(date)}
  //             placeholderText="Select Date of Birth"
  //             dateFormat={"dd/MM/yyyy"}
  //             required
  //           />
  //           <br />
  //           <DatePicker
  //             selected={startDate}
  //             onChange={(date) => setStartDate(date)}
  //             selectsStart
  //             startDate={startDate}
  //             endDate={endDate}
  //             minDate={new Date()}
  //             dateFormat={"dd/MM/yyyy"}
  //             placeholderText="Select start date"
  //           />
  //           <br />
  //           <DatePicker
  //             selected={endDate}
  //             onChange={(date) => setEndDate(date)}
  //             selectsEnd
  //             startDate={startDate}
  //             endDate={endDate}
  //             minDate={startDate}
  //             dateFormat={"dd/MM/yyyy"}
  //             placeholderText="Select end date"
  //           />
  //           <br />
  //           <input
  //             type="number"
  //             placeholder="Phone Number"
  //             value={phno}
  //             onChange={(e) => setPhno(e.target.value)}
  //             required
  //           />
  //           <br />
  //           <input
  //             type="text"
  //             placeholder="Address"
  //             value={address}
  //             onChange={(e) => setAddress(e.target.value)}
  //             required
  //           />
  //           <br />
  //           <button type="submit" id="rt">Confirm Booking</button>
  //         </div>
  //       </div>
  //     </form>
  //   </div>
    
  )}

  {viewProfile && (<ViewProfile/>)}

  </>
  );
};

export default Dashboard;



