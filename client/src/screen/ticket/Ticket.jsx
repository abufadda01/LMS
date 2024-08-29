import React, { useState, useEffect, useRef } from "react";
import MoreSelecter from "./MoreSelecter";
import TicketCard from "./TicketCard";
import axios from "axios";
import "../../style/ticket.scss";

import {
  useAddNewTicketMutation,
  useGetAllUserTicketsQuery,
  addNewTicketSuccess,
  fetchTicketsSuccess,
} from "../../store/store";

import { useDispatch, useSelector } from "react-redux";



const Ticket = () => {

  const dispatch = useDispatch();

  const NextRef = useRef();
  const PrevRef = useRef();

  const { tickets } = useSelector((state) => state.tickets);
  const { token } = useSelector((state) => state.user);

  const [addNewTicket, { isLoading, isError, error }] = useAddNewTicketMutation();

  const [page, setPage] = useState(1);
  const getTicketsResponse = useGetAllUserTicketsQuery({ token, page });

  const user = useSelector((state) => state.user);

  const [regarding, setRegarding] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [info, setInfo] = useState("");

  const [regardingError, setRegardingError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [moreDetailsError, setMoreDetailsError] = useState("");



  const handleFormSubmit = async (e) => {

    e.preventDefault();

    try {
      // Reset error states
      setRegardingError("");
      setSubjectError("");
      setDetailsError("");
      setMoreDetailsError("");

      let isValid = true;

      if (!regarding) {
        setRegardingError("Please select a topic");
        isValid = false;
      }

      if (!subject) {
        setSubjectError("Please fill in the subject");
        isValid = false;
      }

      if (!details) {
        setDetailsError("Please provide some details");
        isValid = false;
      }
      if (!info) {
        setMoreDetailsError("Please provide some  Info");
        isValid = false;
      }

      if (!isValid) {
        return; // Do not submit if any field is invalid
      }

      const data = await addNewTicket({
        ticket: { regarding, subject, details, info },
        token: user.token,
      }).unwrap();

      dispatch(addNewTicketSuccess({ ...data }));

    } catch (err) {
      console.log(err);
    } finally {
      setRegarding("");
      setSubject("");
      setDetails("");
      setInfo("");
    }
  };

  const handleOptionChange = (option) => {
    setInfo(option);
  };

  useEffect(() => {
    if (!getTicketsResponse.isLoading && !getTicketsResponse.isUninitialized) {
      if (getTicketsResponse.isError) {
        console.log("Erorr tikesti");
      } else {
        console.log("4");
        dispatch(fetchTicketsSuccess(getTicketsResponse.data));
      }
    }
  }, [getTicketsResponse]);

  const handelNextPage = () => {
    setPage(page + 1);
  };
  const handelPrevPage = () => {
    setPage(page - 1);
  };

  return (
    <>
      <p style={{ textAlign: "center", fontSize: "2em", margin: "4% 0" }}>
        New Supporte Ticket
      </p>

      <div className="form-container">
        <h2>Contact Us</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Regarding</label>
            <select
              className={`form-control ${regardingError ? "error" : ""}`}
              value={regarding}
              onChange={(e) => setRegarding(e.target.value)}
              required
            >
              <option value="">Select an option</option>
              <option value="content">content</option>
              <option value="technical">technical</option>
            </select>
            {regardingError && (
              <p className="error-message">{regardingError}</p>
            )}
          </div>
          {regarding && (
            <MoreSelecter
              Selecter={regarding}
              Error={moreDetailsError}
              onOptionChange={handleOptionChange}
            />
          )}

          <div className="form-group">
            <label>Subject</label>
            <input
              className={`form-control ${subjectError ? "error" : ""}`}
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            {subjectError && <p className="error-message">{subjectError}</p>}
          </div>
          <div className="form-group">
            <label>Details</label>
            <textarea
              className={`form-control ${detailsError ? "error" : ""}`}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
            {detailsError && <p className="error-message">{detailsError}</p>}
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="hr"></div>
      <div className="TicketResponse" >
<div className="ticketCard">
        {tickets.map((ticket, i) => (
          <TicketCard key={i} ticket={ticket} />
        ))}
</div>
        <div className="buttonsInTickets">

          <button  ref={NextRef} disabled={tickets.length < 10} onClick={handelNextPage}
          >
            NEXT
          </button>

          <button  ref={PrevRef} disabled={page <= 1} onClick={handelPrevPage}>
            PREV
          </button>

        </div>


      </div>
    </>
  );
};

export default Ticket;

// import React, { useState } from "react";
// import "../../style/ticket.scss"
// const ContactForm = () => {
//   const [regarding, setRegarding] = useState("");
//   const [subject, setSubject] = useState("");
//   const [details, setDetails] = useState("");

//   const [regardingError, setRegardingError] = useState("");
//   const [subjectError, setSubjectError] = useState("");
//   const [detailsError, setDetailsError] = useState("");

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     // Reset error states
//     setRegardingError("");
//     setSubjectError("");
//     setDetailsError("");

//     let isValid = true;

//     if (!regarding) {
//       setRegardingError("Please select a topic");
//       isValid = false;
//     }

//     if (!subject) {
//       setSubjectError("Please fill in the subject");
//       isValid = false;
//     }

//     if (!details) {
//       setDetailsError("Please provide some details");
//       isValid = false;
//     }

//     if (!isValid) {
//       return; // Do not submit if any field is invalid
//     }

//     // Form submission logic goes here
//     console.log({ regarding, subject, details });
//   };

//   return (
//     <div className="form-container">
//       <h2>Contact Us</h2>
//       <form onSubmit={handleFormSubmit}>
//         <div className="form-group">
//           <label>Regarding</label>
//           <select
//             className={`form-control ${regardingError ? "error" : ""}`}
//             value={regarding}
//             onChange={(e) => setRegarding(e.target.value)}
//             required
//           >
//             <option value="">Select an option</option>
//             <option value="General Inquiry">General Inquiry</option>
//             <option value="Support">Support</option>
//             <option value="Sales">Sales</option>
//           </select>
//           {regardingError && <p className="error-message">{regardingError}</p>}
//         </div>
//         <div className="form-group">
//           <label>Subject</label>
//           <input
//             className={`form-control ${subjectError ? "error" : ""}`}
//             type="text"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             required
//           />
//           {subjectError && <p className="error-message">{subjectError}</p>}
//         </div>
//         <div className="form-group">
//           <label>Details</label>
//           <textarea
//             className={`form-control ${detailsError ? "error" : ""}`}
//             value={details}
//             onChange={(e) => setDetails(e.target.value)}
//             required
//           />
//           {detailsError && <p className="error-message">{detailsError}</p>}
//         </div>
//         <div className="form-group">
//           <button type="submit" className="submit-button">
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ContactForm;
