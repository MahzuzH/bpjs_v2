import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/frontend/Home/Home";
import Admin from "./pages/backend/Admin/Admin";
import Profiles from "./pages/backend/Admin/Profiles/Profiles";
import Profiles_Create from "./pages/backend/Admin/Profiles/Profiles_Create";
import Profiles_Edit from "./pages/backend/Admin/Profiles/Profiles_Edit";
import Links from "./pages/backend/Admin/Links/Links";
import Links_Create from "./pages/backend/Admin/Links/Links_Create";
import Links_Edit from "./pages/backend/Admin/Links/Links_Edit";
import Socials from "./pages/backend/Admin/Socials/Socials";
import Socials_Create from "./pages/backend/Admin/Socials/Socials_Create";
import Socials_Edit from "./pages/backend/Admin/Socials/Socials_Edit";
import Login from "./pages/backend/Login/Login";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Admin */}
                <Route path="/admin" element={<Admin />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Profiles */}
                <Route path="/admin/profiles" element={<Profiles />} />
                <Route
                    path="/admin/profiles/create"
                    element={<Profiles_Create />}
                />
                <Route
                    path="/admin/profiles/edit/:id"
                    element={<Profiles_Edit />}
                />

                {/* Links */}
                <Route path="/admin/links" element={<Links />} />
                <Route path="/admin/links/create" element={<Links_Create />} />
                <Route path="/admin/links/edit/:id" element={<Links_Edit />} />

                {/* Socials */}
                <Route path="/admin/socials" element={<Socials />} />
                <Route
                    path="/admin/socials/create"
                    element={<Socials_Create />}
                />
                <Route
                    path="/admin/socials/edit/:id"
                    element={<Socials_Edit />}
                />
            </Routes>
        </Router>
    );
};

export default App;
