import React from "react";
import "../../style/ticketCard.scss";

const TicketCard = ({ ticket }) => {
  function checkStatus() {
    if (ticket.status === "pending") return "blue";
    if (ticket.status === "inProgress") return "green";
    if (ticket.status === "closed") return "red";
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const utcDate = new Date(ticket.createdAt);
  const options = {
    timeZone: "Asia/Amman", // Jordan time zone
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour clock and display AM/PM
  };

  const localDateStr = new Intl.DateTimeFormat("en-US", options).format(
    utcDate
  );

  // Parsing the localDateStr to get the individual components
  const localDate = new Date(localDateStr);
  const year = localDate.getFullYear();
  const month = localDate.getMonth(); // Get the month index (0-11)
  const day = localDate.getDate();
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  // const seconds = localDate.getSeconds();
  const amPm = hours >= 12 ? "PM" : "AM";

  // Formatting the time string
  const formattedTime = `${String(hours % 12 || 12).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")} ${amPm}`;

  return (
    <div className="ticketContainer">
      <div className="ticket">
        <div className="ticketTitle">{ticket.regarding}</div>
        <hr />
        <div className="ticketDetail">
          <div>Info:&ensp; {ticket.info}</div>
          <div>Subject:&nbsp;{ticket.subject}</div>
          <div>Time:&emsp; {formattedTime}</div>
          <div>Details:&emsp; {ticket.details} </div>
        </div>
        <div className="ticketRip">
          <div className="circleLeft"></div>
          <div className="ripLine"></div>
          <div className="circleRight"></div>
        </div>
        <div className="ticketSubDetail">
          <div className="code">
            Status:&nbsp;
            <span style={{ color: checkStatus(), fontWeight:"700" }}>{ticket.status}</span>{" "}
          </div>
          <div className="date">
            {monthNames[month]} {day}
            <sup>th</sup> {year}
          </div>
          <hr/>
            <div className="supportTeamResponse" style={{margin:"1em", direction:"ltr"}}>{ticket?.supportTeamResponse}</div>
        </div>
      </div>
      {/* <div className="ticketShadow"></div> */}
    </div>
  );
};

export default TicketCard;
