import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/frontend/Home/Home";
import Dashboard from "./pages/backend/Admin/Dashboard/Dashboard";
import Profiles from "./pages/backend/Admin/Profiles/Profiles";
import ProfilesCreate from "./pages/backend/Admin/Profiles/ProfilesCreate";
import ProfilesEdit from "./pages/backend/Admin/Profiles/ProfilesEdit";
import Links from "./pages/backend/Admin/Links/Links";
import LinksCreate from "./pages/backend/Admin/Links/LinksCreate";
import LinksEdit from "./pages/backend/Admin/Links/LinksEdit";
import Socials from "./pages/backend/Admin/Socials/Socials";
import SocialsCreate from "./pages/backend/Admin/Socials/SocialsCreate";
import SocialsEdit from "./pages/backend/Admin/Socials/SocialsEdit";
import Login from "./pages/backend/Login/Login";
import FiturGantiHP from "./pages/frontend/FiturGantiHP/FiturGantiHP";
import MCSEvent from "./pages/frontend/FiturMCS/FiturMCS";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Fitur Ganti HP */}
                <Route path="/ubah-hp" element={<FiturGantiHP />} />

                {/* Fitur MCS */}
                <Route path="/mcs" element={<MCSEvent />} />

                {/* Admin */}
                <Route path="/admin" element={<Dashboard />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Profiles */}
                <Route path="/admin/profiles" element={<Profiles />} />
                <Route
                    path="/admin/profiles/create"
                    element={<ProfilesCreate />}
                />
                <Route
                    path="/admin/profiles/edit/:id"
                    element={<ProfilesEdit />}
                />

                {/* Links */}
                <Route path="/admin/links" element={<Links />} />
                <Route path="/admin/links/create" element={<LinksCreate />} />
                <Route path="/admin/links/edit/:id" element={<LinksEdit />} />

                {/* Socials */}
                <Route path="/admin/socials" element={<Socials />} />
                <Route
                    path="/admin/socials/create"
                    element={<SocialsCreate />}
                />
                <Route
                    path="/admin/socials/edit/:id"
                    element={<SocialsEdit />}
                />
            </Routes>
        </Router>
    );
};

export default App;
