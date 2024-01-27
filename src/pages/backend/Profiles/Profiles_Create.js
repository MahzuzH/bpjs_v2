import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/backend/Sidebar";
import Navbar from "../../../components/backend/Navbar";
import Footer from "../../../components/backend/Footer";
import { createClient } from "@supabase/supabase-js";

function Profiles_Create() {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [avatar, setAvatar] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);

    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (complete) {
            const timeoutId = setTimeout(() => {
                setComplete(false);
            }, 2000);

            return () => clearTimeout(timeoutId);
        }
    }, [complete]);

    const handleCreate = () => {
        if (!name || !title || !avatar) {
            alert("Please fill in all fields");
            return;
        }

        setShowModal(true);
    };

    const handleConfirm = async () => {
        // Set loading to true when confirming
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from("profiles")
                .insert([{ name, title, avatar }]);

            if (error) {
                console.error("Error creating data:", error.message);
                alert("Error creating data");
            } else {
                setComplete(true);

                setTimeout(() => {
                    setShowModal(false);
                    setLoading(false);
                    navigate("/profiles");
                }, 2000);
            }
        } catch (error) {
            console.error("Error creating data:", error.message);
            alert("Error creating data");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setLoading(false); // Reset loading state when closing the modal
    };

    return (
        <div>
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <Navbar />
                    <div id="content">
                        <div className="container-fluid">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Profiles - Create
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <label>Name:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Title:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Avatar URL:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={avatar}
                                                onChange={(e) =>
                                                    setAvatar(e.target.value)
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn bg-primary font-semibold text-white"
                                            onClick={handleCreate}
                                        >
                                            Create Data
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </div>
                </div>

                {/* Modal Konfirmasi */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data Profiles</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            {complete ? (
                                <div className="checklist-icon mx-auto text-center">
                                    <p
                                        style={{
                                            fontSize: "40px",
                                            color: "green",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        ✅
                                    </p>
                                    <p className="mt-2">
                                        Data berhasil ditambahkan!
                                    </p>
                                </div>
                            ) : loading ? (
                                <div className="text-center">
                                    <Spinner
                                        animation="grow"
                                        role="status"
                                        variant="primary"
                                        style={{
                                            width: "4rem",
                                            height: "4rem",
                                            margin: "auto",
                                        }}
                                    >
                                        <span className="sr-only">
                                            Memuat...
                                        </span>
                                    </Spinner>
                                    <p className="mt-2">
                                        Sedang menambahkan...
                                    </p>
                                </div>
                            ) : (
                                <p className="mt-2">
                                    Apa anda yakin akan menambahkan data?
                                </p>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="danger"
                            onClick={handleCloseModal}
                            className="btn bg-danger btn-secondary font-semibold text-white"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            className="btn bg-primary font-semibold text-white "
                            disabled={loading}
                        >
                            Iya
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Profiles_Create;
