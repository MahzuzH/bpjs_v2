import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../../../components/backend/Sidebar";
import Navbar from "../../../components/backend/Navbar";
import Footer from "../../../components/backend/Footer";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { Modal } from "react-bootstrap";

function Profiles() {
    const [profiles, setProfiles] = useState([]);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // State for animation
    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    const fetchData = async () => {
        const { data, error } = await supabase.from("profiles").select();
        if (error) {
            console.error("Error fetching data:", error.message);
        } else {
            setProfiles(data);
        }
    };

    const navigate = useNavigate();
    const [isCreateMode, setCreateMode] = useState(false);

    const handleCreate = () => {
        setCreateMode(true);
        navigate("/profiles/create");
    };

    const handleConfirmCreate = async () => {
        // Perform confirmation operation, e.g., add data to Supabase
        // ...

        // Set state to show success animation
        setShowSuccessAnimation(true);

        // After the operation is complete, navigate to the Profiles page
        setTimeout(() => {
            setShowSuccessAnimation(false);
            navigate("/profiles");
        }, 2000); // Display the animation for 2 seconds
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from("profiles").delete().eq("id", id);
        if (error) {
            console.error("Error deleting data:", error.message);
        } else {
            fetchData();
        }
    };

    const handleEdit = (id) => {
        console.log(`Edit item with ID ${id}`);
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                                        Profiles
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
                                                        Id Profiles
                                                    </th>
                                                    <th
                                                        style={{
                                                            verticalAlign:
                                                                "middle",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        Name
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
                                                        Avatar
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
                                                {profiles.map((item) => (
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
                                                            {item.name}
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
                                                                        item.avatar
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
                                                                        handleDelete(
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
        </div>
    );
}

export default Profiles;
