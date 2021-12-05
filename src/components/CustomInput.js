import React from "react";

const CustomInput = ({ label, value, setValue, type = "text" }) => {
  return (
    <div style={{ margin: "5% auto" }}>
      <label>{label}</label>
      <input
        style={{ width: "100%" }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
      />
    </div>
  );
};

export default CustomInput;
