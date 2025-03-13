import React from "react";
import "./SpinLoader.scss";
const SpinLoader = () => {
  return (
    <div class="spinLoader">
      <div class="three-body">
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
      </div>
    </div>
  );
};

export default SpinLoader;
