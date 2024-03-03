import React from "react";

function ProtectedRoute (props) {
  return (
    <>{props.children}</>
  );
}

export default ProtectedRoute;