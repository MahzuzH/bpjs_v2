import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/frontend/Home/Home";
import Admin from "./pages/backend/Admin";
import Profiles from "./pages/backend/Profiles/Profiles";
import Profiles_Create from "./pages/backend/Profiles/Profiles_Create";
import Profiles_Edit from "./pages/backend/Profiles/Profiles_Edit";
import Socials from "./pages/backend/Socials/Socials";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<Admin />} />

                <Route path="/profiles" element={<Profiles />} />
                <Route path="/profiles/create" element={<Profiles_Create />} />
                <Route path="/profiles/edit/:id" element={<Profiles_Edit />} />

                <Route path="/links" element={<Admin />} />
                <Route path="/socials" element={<Socials />} />
            </Routes>
        </Router>
    );
};

export default App;
