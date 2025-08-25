import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    const navItemClass = (path) => {
        return location.pathname === path ? "nav-item active" : "nav-item";
    };

    return (
        <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
        >
            <Link
                to={"/admin"}
                className="sidebar-brand d-flex align-items-center justify-content-center"
            >
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Admin Dashboard</div>
            </Link>
            <hr className="sidebar-divider my-0" />
            <li className={navItemClass("/admin")}>
                <Link to={"/admin"} className="nav-link">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </Link>
            </li>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Table</div>

            <li className={navItemClass("/admin/profiles")}>
                <Link to={"/admin/profiles"} className="nav-link">
                    <i className="fas fa-fw fa-user"></i>
                    <span>Profiles</span>
                </Link>
            </li>

            <li className={navItemClass("/admin/links")}>
                <Link to={"/admin/links"} className="nav-link">
                    <i className="fas fa-fw fa-link"></i>
                    <span>Links</span>
                </Link>
            </li>

            <li className={navItemClass("/admin/socials")}>
                <Link to={"/admin/socials"} className="nav-link">
                    <i className="fas fa-fw fa-rss"></i>
                    <span>Socials</span>
                </Link>
            </li>

            <li className={navItemClass("/admin/mcs")}>
                <Link to={"/admin/mcs"} className="nav-link">
                    <i className="fas fa-fw fa-calendar-alt"></i>
                    <span>Jadwal MCS</span>
                </Link>
            </li>
        </ul>
    );
};

export default Sidebar;
