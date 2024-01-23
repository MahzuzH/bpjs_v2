import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/frontend/Home/Home";
import Admin from "./pages/backend/Admin";
import Profiles from "./pages/backend/Profiles/Profiles";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<Admin />} />
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/links" element={<Admin />} />
                <Route path="/socials" element={<Admin />} />
            </Routes>
        </Router>
    );
};

export default App;
