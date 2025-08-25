// src/pages/backend/.../LinksCreate.jsx (ganti nama jika perlu, mis. McsEventsCreate.jsx)
import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../../components/backend/Sidebar";
import Navbar from "../../../../components/backend/Navbar";
import Footer from "../../../../components/backend/Footer";
import { createClient } from "@supabase/supabase-js";

function MCSCreate() {
    // === STATE untuk mcs_events ===
    const [title, setTitle] = useState("");
    const [eventDate, setEventDate] = useState(""); // YYYY-MM-DD
    const [startTime, setStartTime] = useState(""); // HH:mm
    const [endTime, setEndTime] = useState(""); // HH:mm (opsional)
    const [location, setLocation] = useState("");

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
            const timeoutId = setTimeout(() => setComplete(false), 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [complete]);

    // helper untuk normalisasi jam "HH:mm" -> "HH:mm:ss"
    const toTimeSQL = (hhmm) => (hhmm ? `${hhmm}:00` : null);

    const handleCreate = () => {
        if (!title || !eventDate || !startTime || !location) {
            alert("Mohon lengkapi Title, Tanggal, Jam Mulai, dan Lokasi.");
            return;
        }
        setShowModal(true);
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const payload = {
                // id_jadwalmcs biarkan NULL agar diisi default UUID dari DB
                event_date: eventDate,
                title: title,
                start_time: toTimeSQL(startTime), // "HH:mm:ss"
                end_time: endTime ? toTimeSQL(endTime) : null,
                location: location,
            };

            const { error } = await supabase
                .from("mcs_events")
                .insert([payload]);

            if (error) {
                console.error("Error creating data:", error.message);
                alert("Gagal menambahkan data: " + error.message);
                setLoading(false);
                return;
            }

            setComplete(true);
            setTimeout(() => {
                setShowModal(false);
                setLoading(false);
                // arahkan ke daftar jadwal (ubah path sesuai routing Anda)
                navigate("/admin/mcs");
            }, 1200);
        } catch (err) {
            console.error("Error creating data:", err?.message || err);
            alert("Terjadi kesalahan saat menambahkan data.");
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setLoading(false);
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
                                        Jadwal MCS — Tambah
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="form-group">
                                            <label>Judul Kegiatan</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Mis. Gebyar Amerika"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label>Tanggal</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={eventDate}
                                                    onChange={(e) =>
                                                        setEventDate(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>Jam Mulai</label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={startTime}
                                                    onChange={(e) =>
                                                        setStartTime(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>
                                                    Jam Selesai (opsional)
                                                </label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={endTime}
                                                    onChange={(e) =>
                                                        setEndTime(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Lokasi</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Mis. Alun Alun Kecamatan Pamanukan"
                                                value={location}
                                                onChange={(e) =>
                                                    setLocation(e.target.value)
                                                }
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="btn bg-primary font-semibold text-white"
                                            onClick={handleCreate}
                                        >
                                            Tambah Jadwal
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>

                {/* Modal Konfirmasi */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Konfirmasi Tambah Jadwal</Modal.Title>
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
                                <>
                                    <p className="mb-2">
                                        Apakah data berikut sudah benar?
                                    </p>
                                    <div className="text-left small">
                                        <div>
                                            <strong>Judul:</strong>{" "}
                                            {title || "-"}
                                        </div>
                                        <div>
                                            <strong>Tanggal:</strong>{" "}
                                            {eventDate || "-"}
                                        </div>
                                        <div>
                                            <strong>Jam:</strong>{" "}
                                            {startTime || "-"}
                                            {endTime ? ` – ${endTime}` : ""}
                                        </div>
                                        <div>
                                            <strong>Lokasi:</strong>{" "}
                                            {location || "-"}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="danger"
                            onClick={handleCloseModal}
                            className="btn bg-danger btn-secondary font-semibold text-white"
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            className="btn bg-primary font-semibold text-white"
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

export default MCSCreate;
