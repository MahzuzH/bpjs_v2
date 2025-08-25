import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Modal, Button, Spinner, Fade } from "react-bootstrap";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Sidebar from "../../../../components/backend/Sidebar";
import Navbar from "../../../../components/backend/Navbar";
import Footer from "../../../../components/backend/Footer";

function MCS() {
    const [MCS, setMCS] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [isCreateMode, setCreateMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setDeleteLoading] = useState(false);
    const [complete, setComplete] = useState(false);
    const navigate = useNavigate();

    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    useEffect(() => {
        fetchData();
        document.title = "Admin | MCS";
    }, []);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from("mcs_events")
            .select("*")
            .order("id_jadwalmcs_int", { ascending: true, nullsFirst: true });

        if (error) {
            console.error("Error fetching data:", error.message);
        } else {
            setMCS(data || []);
        }
    };

    const handleCreate = () => {
        setCreateMode(true);
        navigate("/admin/mcs/create");
    };

    const handleConfirmDelete = async () => {
        if (deleteId == null) return;
        setDeleteLoading(true);

        try {
            const { error } = await supabase
                .from("mcs_events")
                .delete()
                .eq("id_jadwalmcs_int", Number(deleteId)); // FIX: pakai kolom integer baru

            if (error) {
                console.error("Error deleting data:", error.message);
            } else {
                setComplete(true);
                setTimeout(() => {
                    setShowDeleteModal(false);
                    setDeleteLoading(false);
                    setComplete(false);
                    setDeleteId(null);
                    fetchData();
                }, 1200);
            }
        } catch (error) {
            console.error("Error deleting data:", error.message);
            setDeleteLoading(false);
        }
    };

    const handleShowDeleteModal = (id_jadwalmcs_int) => {
        setDeleteId(id_jadwalmcs_int); // FIX: pastikan yang dikirim id_jadwalmcs_int
        setShowDeleteModal(true);
        setComplete(false);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const handleEdit = (id_jadwalmcs_int) => {
        navigate(`/admin/mcs/edit/${id_jadwalmcs_int}`);
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
                                <div className="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Jadwal MCS
                                    </h6>
                                    {!isCreateMode && (
                                        <button
                                            className="btn btn-success btn-sm d-flex align-items-center text-white font-weight-bold"
                                            onClick={handleCreate}
                                        >
                                            <FiPlus
                                                style={{
                                                    marginRight: 5,
                                                    fontSize: 20,
                                                }}
                                            />
                                            Create Data
                                        </button>
                                    )}
                                </div>

                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table
                                            className="table table-bordered"
                                            width="100%"
                                            cellSpacing="0"
                                        >
                                            <thead>
                                                <tr>
                                                    <th className="text-center align-middle">
                                                        Id Jadwal MCS
                                                    </th>
                                                    <th className="text-center align-middle">
                                                        Jadwal MCS
                                                    </th>
                                                    <th className="text-center align-middle">
                                                        Title
                                                    </th>
                                                    <th className="text-center align-middle">
                                                        Jam Mulai
                                                    </th>
                                                    <th className="text-center align-middle">
                                                        Jam Selesai
                                                    </th>
                                                    <th className="text-center align-middle">
                                                        Lokasi
                                                    </th>
                                                    <th className="text-center align-middle">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {MCS.map((item) => (
                                                    <tr
                                                        key={
                                                            item.id_jadwalmcs_int /* FIX: key pakai integer */
                                                        }
                                                    >
                                                        <td className="text-center align-middle">
                                                            {
                                                                item.id_jadwalmcs_int
                                                            }
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {item.event_date}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {item.title}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {item.start_time}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {item.end_time ||
                                                                "-"}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            {item.location}
                                                        </td>
                                                        <td className="text-center align-middle">
                                                            <div
                                                                style={{
                                                                    height: 50,
                                                                    display:
                                                                        "flex",
                                                                    gap: 10,
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleShowDeleteModal(
                                                                            item.id_jadwalmcs_int
                                                                        )
                                                                    } // FIX: tidak salah nama
                                                                >
                                                                    <FiTrash2
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            item.id_jadwalmcs_int
                                                                        )
                                                                    }
                                                                >
                                                                    <FiEdit
                                                                        style={{
                                                                            fontSize: 20,
                                                                        }}
                                                                    />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {MCS.length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan={7}
                                                            className="text-center text-muted"
                                                        >
                                                            Belum ada data.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            {/* Modal Konfirmasi Hapus Data */}
            <Modal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                component={Fade}
                backdrop={true}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi Hapus Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        {complete ? (
                            <div className="checklist-icon mx-auto text-center">
                                <p
                                    style={{
                                        fontSize: 40,
                                        color: "green",
                                        marginBottom: 10,
                                    }}
                                >
                                    ✅
                                </p>
                                <p className="mt-2">Data berhasil dihapus!</p>
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
                                <p className="mt-2">Sedang menghapus...</p>
                            </div>
                        ) : (
                            <p className="mt-2">
                                Apa anda yakin akan menghapus data ini?
                            </p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleCloseDeleteModal}
                        className="btn bg-danger btn-secondary font-semibold text-white"
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmDelete}
                        className="btn bg-primary font-semibold text-white"
                        disabled={loading}
                    >
                        Iya
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MCS;
