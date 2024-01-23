import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItemClass = (path) => {
        return isActive(path) ? "nav-item active" : "nav-item";
    };
    return (
        <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
        >
            <Link
                to={"/dashboard"}
                className="sidebar-brand d-flex align-items-center justify-content-center"
            >
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Admin Dashboard</div>
            </Link>
            <hr className="sidebar-divider my-0" />
            <li className="nav-item">
                <Link to={"/dashboard"} className="nav-link">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </Link>
            </li>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Table</div>

            <li className={navItemClass("/profiles")}>
                <Link to={"/profiles"} className="nav-link">
                    <i className="fas fa-fw fa-user"></i>
                    <span>Profiles</span>
                </Link>
            </li>

            <li className={navItemClass("/links")}>
                <Link to={"/links"} className="nav-link">
                    <i className="fas fa-fw fa-link"></i>
                    <span>Links</span>
                </Link>
            </li>

            <li className={navItemClass("/socials")}>
                <Link to={"/socials"} className="nav-link">
                    <i className="fas fa-fw fa-rss"></i>
                    <span>Socials</span>
                </Link>
            </li>
        </ul>
    );
}

export default Sidebar;
