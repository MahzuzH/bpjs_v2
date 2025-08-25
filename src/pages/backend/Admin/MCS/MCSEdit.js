// src/pages/backend/.../MCSEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "./Supabase"; // Instance supabase kamu
import Sidebar from "../../../../components/backend/Sidebar";
import Navbar from "../../../../components/backend/Navbar";
import Footer from "../../../../components/backend/Footer";
import { Modal, Button, Spinner } from "react-bootstrap";

function MCSEdit() {
    const { id } = useParams(); // <-- gunakan integer id_jadwalmcs_int
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        event_date: "",
        start_time: "",
        end_time: "",
        location: "",
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);

    // helper HH:mm -> HH:mm:ss
    const toTimeSQL = (hhmm) => (hhmm ? `${hhmm}:00` : null);

    // Fetch data awal berdasarkan id_jadwalmcs_int
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data, error } = await supabase
                    .from("mcs_events")
                    .select("*")
                    .eq("id_jadwalmcs_int", Number(id))
                    .single();

                if (error) {
                    console.error("Error fetch:", error.message);
                    return;
                }

                if (data) {
                    setForm({
                        title: data.title ?? "",
                        event_date: data.event_date ?? "",
                        // potong detik agar cocok dengan input type="time"
                        start_time: data.start_time
                            ? String(data.start_time).slice(0, 5)
                            : "",
                        end_time: data.end_time
                            ? String(data.end_time).slice(0, 5)
                            : "",
                        location: data.location ?? "",
                    });
                }
            } catch (err) {
                console.error("Unhandled error:", err?.message || err);
            }
        };

        fetchEvent();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => setShowConfirmModal(false);

    const confirmUpdate = async () => {
        setLoading(true);
        try {
            const payload = {
                title: form.title,
                event_date: form.event_date,
                start_time: toTimeSQL(form.start_time),
                end_time: form.end_time ? toTimeSQL(form.end_time) : null,
                location: form.location,
            };

            const { error } = await supabase
                .from("mcs_events")
                .update(payload)
                .eq("id_jadwalmcs_int", Number(id));

            if (error) {
                console.error("Error updating:", error.message);
                setLoading(false);
                return;
            }

            setComplete(true);
            setLoading(false);

            setTimeout(() => {
                closeConfirmModal();
                navigate("/admin/mcs"); // <-- sesuaikan rute daftar
            }, 1200);
        } catch (err) {
            console.error("Unhandled error:", err?.message || err);
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
                                        Jadwal MCS — Edit
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="title">
                                                Judul Kegiatan
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                name="title"
                                                value={form.title}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="event_date">
                                                    Tanggal
                                                </label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="event_date"
                                                    name="event_date"
                                                    value={form.event_date}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="start_time">
                                                    Jam Mulai
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="start_time"
                                                    name="start_time"
                                                    value={form.start_time}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="end_time">
                                                    Jam Selesai (opsional)
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    id="end_time"
                                                    name="end_time"
                                                    value={form.end_time}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="location">
                                                Lokasi
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="location"
                                                name="location"
                                                value={form.location}
                                                onChange={handleInputChange}
                                                placeholder="Mis. Alun Alun Kecamatan Pamanukan"
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
                    <Modal.Title>Update Jadwal MCS</Modal.Title>
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
                            <>
                                <p className="mt-2">
                                    Apakah Anda yakin ingin mengupdate data
                                    berikut?
                                </p>
                                <div className="text-left small">
                                    <div>
                                        <strong>Judul:</strong>{" "}
                                        {form.title || "-"}
                                    </div>
                                    <div>
                                        <strong>Tanggal:</strong>{" "}
                                        {form.event_date || "-"}
                                    </div>
                                    <div>
                                        <strong>Jam:</strong>{" "}
                                        {form.start_time || "-"}
                                        {form.end_time
                                            ? ` – ${form.end_time}`
                                            : ""}
                                    </div>
                                    <div>
                                        <strong>Lokasi:</strong>{" "}
                                        {form.location || "-"}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={closeConfirmModal}
                        className="btn bg-danger btn-secondary font-semibold text-white"
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={confirmUpdate}
                        className="btn bg-primary font-semibold text-white"
                        disabled={loading}
                    >
                        {complete ? "Tutup" : "Iya"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MCSEdit;
