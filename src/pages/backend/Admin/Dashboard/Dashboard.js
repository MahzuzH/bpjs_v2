import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../../../../components/backend/Sidebar";
import Navbar from "../../../../components/backend/Navbar";
import Footer from "../../../../components/backend/Footer";

const Dashboard = () => {
    const [profilesCount, setProfilesCount] = useState(0);
    const [linksCount, setLinksCount] = useState(0);
    const [socialsCount, setSocialsCount] = useState(0);

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

    useEffect(() => {
        fetchCounts();
        document.title = "Admin | Dashboard";
    }, []);

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
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
