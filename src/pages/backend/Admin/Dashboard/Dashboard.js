import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../../../../components/backend/Sidebar";
import Navbar from "../../../../components/backend/Navbar";
import Footer from "../../../../components/backend/Footer";

const Dashboard = () => {
    const [profilesCount, setProfilesCount] = useState(0);
    const [linksCount, setLinksCount] = useState(0);
    const [socialsCount, setSocialsCount] = useState(0);
    const [pendingRequests, setPendingRequests] = useState([]); // For holding pending No. HP change requests

    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    const fetchCounts = async () => {
        try {
            const [profileData, linkData, socialData] = await Promise.all([
                supabase
                    .from("profiles")
                    .select("id_profiles", { count: "exact" }),
                supabase.from("links").select("id_links", { count: "exact" }),
                supabase
                    .from("socials")
                    .select("id_socials", { count: "exact" }),
            ]);

            setProfilesCount(profileData.data.length);
            setLinksCount(linkData.data.length);
            setSocialsCount(socialData.data.length);
        } catch (error) {
            console.error("Error fetching counts:", error.message);
        }
    };

    // Fetch pending requests
    const fetchPendingRequests = async () => {
        const { data, error } = await supabase
            .from("hp_change_requests")
            .select()
            .eq("status", "pending"); // Only fetch pending requests

        if (error) {
            console.error("Error fetching pending requests:", error.message);
        } else {
            setPendingRequests(data); // Set pending requests data
        }
    };

    useEffect(() => {
        fetchCounts();
        fetchPendingRequests(); // Fetch pending requests on page load
        document.title = "Admin | Dashboard";
    }, []);

    // Function to handle approval or rejection of the request
    const handleRequestUpdate = async (requestId, action) => {
        const status = action === "approve" ? "confirmed" : "rejected"; // Update status based on action
        const { error } = await supabase
            .from("hp_change_requests")
            .update({ status })
            .eq("id", requestId); // Update the request status

        if (error) {
            console.error("Error updating request status:", error.message);
        } else {
            // If approved, update the user's No. HP in the users table
            if (status === "confirmed") {
                const request = pendingRequests.find((r) => r.id === requestId);
                await supabase
                    .from("users")
                    .update({ no_hp: request.new_no_hp })
                    .eq("nik", request.nik); // Update the user's No. HP

                alert("No. HP successfully updated!");
            }

            // Refresh pending requests
            fetchPendingRequests();
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
                            <div className="row">
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-primary shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                        Profiles
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {profilesCount}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-fw fa-user fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-success shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                        Links
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {linksCount}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-fw fa-link fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-info shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                        Socials
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {socialsCount}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-fw fa-rss fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Display Pending Requests */}
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="text-center mb-4">
                                        Pending No. HP Change Requests
                                    </h3>
                                    {pendingRequests.length === 0 ? (
                                        <p className="text-center">
                                            No pending requests.
                                        </p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>NIK</th>
                                                        <th>Old No. HP</th>
                                                        <th>New No. HP</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pendingRequests.map(
                                                        (request) => (
                                                            <tr
                                                                key={request.id}
                                                            >
                                                                <td>
                                                                    {
                                                                        request.nik
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        request.old_no_hp
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        request.new_no_hp
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() =>
                                                                            handleRequestUpdate(
                                                                                request.id,
                                                                                "approve"
                                                                            )
                                                                        }
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-danger ml-2"
                                                                        onClick={() =>
                                                                            handleRequestUpdate(
                                                                                request.id,
                                                                                "reject"
                                                                            )
                                                                        }
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
