import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "./Supabase"; //
import Sidebar from "../../../../components/backend/Sidebar";
import Navbar from "../../../../components/backend/Navbar";
import Footer from "../../../../components/backend/Footer";
import { Modal, Button, Spinner } from "react-bootstrap";

function ProfilesEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        title: "",
        subtitle: "",
        avatar: "",
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select()
                    .eq("id_profiles", id)
                    .single();

                if (error) {
                    console.log("ID Profiles:", id);
                    console.error(
                        "Error fetching profile data:",
                        error.message
                    );
                } else if (data) {
                    setProfileData(data);
                }
            } catch (error) {
                console.error("Unhandled error:", error.message);
            }
        };

        fetchProfileData();
    }, [id, supabase]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const openConfirmModal = () => {
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        openConfirmModal(); // Membuka modal konfirmasi
    };

    const confirmUpdate = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    title: profileData.title,
                    subtitle: profileData.subtitle,
                    avatar: profileData.avatar,
                })
                .eq("id_profiles", id);

            if (error) {
                console.error("Error updating profile data:", error.message);
            } else {
                setComplete(true);
                setLoading(false);

                setTimeout(() => {
                    closeConfirmModal();
                    navigate("/admin/profiles");
                }, 2000);
            }
        } catch (error) {
            console.error("Unhandled error:", error.message);
            setLoading(false);
        }
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
                                        Profiles - Edit
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="title">
                                                Title:
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                name="title"
                                                value={profileData.title}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="subtitle">
                                                Subtitle:
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subtitle"
                                                name="subtitle"
                                                value={profileData.subtitle}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="avatar">
                                                Avatar URL:
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="avatar"
                                                name="avatar"
                                                value={profileData.avatar}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn bg-primary font-semibold text-white"
                                        >
                                            Simpan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            {/* Modal Konfirmasi */}
            <Modal show={showConfirmModal} onHide={closeConfirmModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Links Data</Modal.Title>
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
                                <p className="mt-2">Data berhasil diupdate!</p>
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
                                    <span className="sr-only">Memuat...</span>
                                </Spinner>
                                <p className="mt-2">Sedang menyimpan...</p>
                            </div>
                        ) : (
                            <p className="mt-2">
                                Apakah Anda yakin ingin mengupdate data?
                            </p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={closeConfirmModal}
                        className="btn bg-danger btn-secondary font-semibold text-white"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={confirmUpdate}
                        className="btn bg-primary font-semibold text-white"
                    >
                        {complete ? "Batal" : "Iya"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProfilesEdit;
