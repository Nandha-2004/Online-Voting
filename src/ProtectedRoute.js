import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const userType = localStorage.getItem("userType");
    const voterid = localStorage.getItem("voterid"); // Get userType from local storage

    if (!userType) {
        return <Navigate to="/" replace />; // Redirect if not logged in
    }

    // 🚀 Prevent users from manually changing their URL
    if (userType === "user" && !allowedRoles.includes("user")) {
        return <Navigate to="/User" replace />;
    }

    if (userType === "user" && voterid === "" && !allowedRoles.includes("user")) {
        return <Navigate to="/" replace />;
    }

    if (userType === "admin" && !allowedRoles.includes("admin")) {
        return <Navigate to="/Admin" replace />;
    }

    return element; // ✅ Render the requested component
};

export default ProtectedRoute;
