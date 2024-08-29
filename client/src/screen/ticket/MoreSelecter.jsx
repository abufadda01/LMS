import React, { useEffect, useState } from 'react';
import "../../style/ticket.scss";

 const MoreSelecter = ({ Selecter, Error,onOptionChange }) => {
  const [option, setOption] = useState([]);

  const contentValue = ["Math", "English", "Science"];
  const technicalValue = ["Broken Links", "Missing Content", "Slow Performance", "Other"];

  function whenSelectChange() {
    if (Selecter === "content") {
       setOption(contentValue);
    } else {
       setOption(technicalValue);
    }
  }

  useEffect(() => {
    whenSelectChange();
  }, [Selecter]);

  const handleSelectChange = (e) => {
    onOptionChange(e.target.value);
  };
  return (
    <>
      <div className="form-group">

        <label>Info.</label>
        <select className={`form-control ${Selecter === "" ? "error" : ""}`} onChange={handleSelectChange} required>
          <option value="">Select an option</option>
          {
            option.map((val,index)=>(
                       <option key={index} value={val}>
                       {val}
                     </option>
            ))
            
          }
        </select>
        {Error && <p className="error-message">{Error}</p>}
      </div>
    </>
  );
};
export default MoreSelecter

// Selecter === "content"
//               ? (
//                 <>
//                   {contentValue.map((val, index) => (
//                     <option key={index} value={val}>
//                       {val}
//                     </option>
//                   ))}
//                 </>
//               )
//               :
//               (
//                 <>
//                   {technicalValue.map((val, index) => (
//                     <option key={index} value={val}>
//                       {val}
//                     </option>
//                   ))}
//                 </>
//               )