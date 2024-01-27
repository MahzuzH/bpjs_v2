import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../pages/backend/Login/UserContext"; // Imp
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Navbar() {
    const navigate = useNavigate();
    const { setUser, userEmail } = useUser();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setTimeout(() => {
            setUser(null);
            setShowLogoutModal(false);
            navigate("/login");
        }, 1000);
    };

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <ul className="navbar-nav ml-auto">
                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="userDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                            {userEmail || "Guest"}
                        </span>
                        <img
                            className="img-profile rounded-circle"
                            src="img/undraw_profile.svg"
                            alt="User profile"
                        />
                    </a>

                    <div
                        className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown"
                    >
                        <a
                            className="dropdown-item"
                            href="#"
                            onClick={openLogoutModal}
                        >
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </a>
                    </div>
                </li>
            </ul>

            {/* Logout Modal */}
            <Modal show={showLogoutModal} onHide={closeLogoutModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Logout Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn bg-danger btn-secondary font-semibold text-white"
                        onClick={closeLogoutModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="btn bg-primary font-semibold text-white "
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </nav>
    );
}

export default Navbar;
