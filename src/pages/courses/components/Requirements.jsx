import React from "react";
import "../styles/CourseDetails.css";
import { FaCheck } from "react-icons/fa";

const Requirements = ({ requirements = [] }) => {
  return (
    <div className="requirements-box">
      <h2>Requirements</h2>

      <ul className="requirements-list">
        {requirements.map((req, index) => (
          <li key={index} className="requirement-item">
            <FaCheck className="req-check-icon" />
            {req}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Requirements;
