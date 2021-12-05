import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ progress }) => {
  return (
    <>
      <div className="gauge-bar">
        <div style={{ width: `${progress || 0}%` }} className="current-gauge">
          {progress}%
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
