import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Modal, Button, Spinner, Fade } from "react-bootstrap";
import { FiEdit, FiTrash2, FiPlus, FiCheck } from "react-icons/fi";
import Sidebar from "../../../../components/backend/Sidebar";
import Navbar from "../../../../components/backend/Navbar";
import Footer from "../../../../components/backend/Footer";

function Links() {
    const [links, setLinks] = useState([]);
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
        document.title = "Admin | Links";
    }, []);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from("links")
            .select()
            .order("id", { ascending: true, nullsFirst: true });

        if (error) {
            console.error("Error fetching data:", error.message);
        } else {
            setLinks(data);
        }
    };

    const handleCreate = () => {
        setCreateMode(true);
        navigate("/links/create");
    };

    const handleConfirmDelete = async () => {
        setDeleteLoading(true);

        try {
            const { error } = await supabase
                .from("links")
                .delete()
                .eq("id", deleteId);

            if (error) {
                console.error("Error deleting data:", error.message);
            } else {
                setComplete(true);

                setTimeout(() => {
                    setShowDeleteModal(false);
                    setDeleteLoading(false);
                    setComplete(false);
                    fetchData();
                }, 2000);
            }
        } catch (error) {
            console.error("Error deleting data:", error.message);
        }
    };

    const handleShowDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
        setComplete(false);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const handleEdit = (id) => {
        navigate(`/links/edit/${id}`);
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
                                        Links
                                    </h6>
                                    {!isCreateMode && (
                                        <button
                                            className="btn btn-success btn-sm mt-2 d-flex align-items-center text-white font-weight-bold"
                                            onClick={handleCreate}
                                        >
                                            <FiPlus
                                                style={{
                                                    marginRight: "5px",
                                                    fontSize: "20px",
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
                                            id="dataTable"
                                            width="100%"
                                            cellspacing="0"
                                        >
                                            <thead>
                                                <tr>
                                                    <th
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Id Links
                                                    </th>
                                                    <th
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Title
                                                    </th>
                                                    <th
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Url
                                                    </th>
                                                    <th
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Image
                                                    </th>
                                                    <th
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {links.map((item) => (
                                                    <tr key={item.id}>
                                                        <td
                                                            style={{
                                                                verticalAlign:
                                                                    "middle",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {item.id}
                                                        </td>
                                                        <td
                                                            style={{
                                                                verticalAlign:
                                                                    "middle",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {item.title}
                                                        </td>
                                                        <td
                                                            style={{
                                                                verticalAlign:
                                                                    "middle",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {item.url}
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    height: "50px",
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt="Avatar"
                                                                    style={{
                                                                        maxWidth:
                                                                            "100%",
                                                                        maxHeight:
                                                                            "100%",
                                                                        width: "auto",
                                                                        height: "auto",
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>

                                                        <td
                                                            style={{
                                                                verticalAlign:
                                                                    "middle",
                                                                textAlign:
                                                                    "center",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    height: "50px",
                                                                    display:
                                                                        "flex",
                                                                    gap: "10px",
                                                                }}
                                                            >
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleShowDeleteModal(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FiTrash2
                                                                        style={{
                                                                            fontSize:
                                                                                "20px",
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FiEdit
                                                                        style={{
                                                                            fontSize:
                                                                                "20px",
                                                                        }}
                                                                    />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </div>
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
                                        fontSize: "40px",
                                        color: "green",
                                        marginBottom: "10px",
                                    }}
                                >
                                    ✅
                                </p>
                                <p className="mt-2">
                                    {/* <FiCheck size={40} color="green" /> */}
                                    Data berhasil dihapus!
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
                    >
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmDelete}
                        className="btn bg-primary font-semibold text-white "
                    >
                        {complete ? "Iya" : "Iya"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Links;
