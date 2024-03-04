import React, { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
import Modal from "../modal/modal";
import "../Home/Home.css";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import XIcon from "../icon/XIcon";
import LinkedinIcon from "../icon/LinkdeinIcon";
import InstagramIcon from "../icon/InstagramIcon";
import TiktokIcon from "../icon/TiktokIcon";
import FacebookIcon from "../icon/FacebookIcon";

function Home() {
    const [modalOn, setModalOn] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [linktreeData, setlinktreeData] = useState([]);
    const [linksData, setLinksData] = useState([]);
    const [socialsData, setSocialsData] = useState([]);
    const [profileData, setProfileData] = useState({});
    const navigate = useNavigate();
    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    const openModal = () => {
        setModalOn(true);
    };

    const closeModal = () => {
        setModalOn(false);
    };

    const fetchDataForTables = async () => {
        setLoading(true);
        try {
            const { data: linktreeData, error: linktreeError } = await supabase
                .from("linktree")
                .select("*");
            if (linktreeError) {
                throw linktreeError;
            }

            const profileIds = linktreeData.map(
                (linktreeData) => linktreeData.id_profiles
            );
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .in("id_profiles", profileIds)
                .single();

            const linksIds = linktreeData.map(
                (linktreeData) => linktreeData.id_links
            );
            const { data: linksData, error: linksError } = await supabase
                .from("links")
                .select("*")
                .in("id_links", linksIds);

            const socialsIds = linktreeData.map(
                (linktreeData) => linktreeData.id_socials
            );
            const { data: socialsData, error: socialsError } = await supabase
                .from("socials")
                .select("*")
                .in("id_socials", socialsIds);
            if (socialsError) {
                throw socialsError;
            }

            console.log("Linktree Data:", linktreeData);
            console.log("Links Data:", linksData);
            console.log("Profile Data:", profileData);
            console.log("Socials Data:", socialsData);

            setlinktreeData(linktreeData);
            setLinksData(linksData);
            setSocialsData(socialsData);
            setProfileData(profileData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentYear(new Date().getFullYear());
        }, 1000);

        fetchDataForTables();

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleLogin = () => {
        navigate("/login");
    };

    const handleLinkClick = (url, isModal) => {
        isModal ? openModal() : window.open(url, "_blank");
    };

    return (
        <div className="App">
            <div className="container flex items-center text-center flex-col justify-center mx-auto lg:px-36 md:px-4 ">
                <button
                    className="absolute top-4 right-4 px-2 py-2 bg-blue-800 text-white rounded-md "
                    onClick={handleLogin}
                >
                    <FiLogIn
                        style={{
                            fontSize: "20px",
                        }}
                    />
                </button>
                {Object.keys(profileData).length > 0 && (
                    <div className="flex flex-col items-center justify-center">
                        <img
                            src={profileData.avatar}
                            className="mb-4 mt-16"
                            alt="logo"
                            width={96}
                            height={96}
                        />
                        <h1 className="font-bold mt-4 text-base text-black font-poppins md:text-lg lg:text-xl">
                            {profileData.title}
                        </h1>
                        <h2 className="px-8 mb-8 text-sm text-black font-monstserrat font-semibold md:text-base lg:text-lg">
                            {profileData.subtitle}
                        </h2>
                    </div>
                )}
                {loading ? (
                    <p>Please wait while links ready...</p>
                ) : (
                    <ul className="flex flex-col w-full lg:w-4/5">
                        {linksData.map((link) => (
                            <li
                                key={link.id_links}
                                className="cursor-pointer rounded-xl m-2 p-1 hover:scale-105 transition-all bg-gray-100 border-blue-900 border-4"
                            >
                                <div
                                    className="flex items-center"
                                    onClick={() =>
                                        handleLinkClick(link.url, link.isModal)
                                    }
                                >
                                    <img
                                        className="rounded-lg w-12 md:w-16 lg:w-18"
                                        alt={link.title}
                                        src={link.image}
                                    />
                                    <p className="flex justify-center items-center w-full font-poppins text-sm tracking-tighter -ml-1 text-black md:text-lg md:-ml-10 md:tracking-normal lg:text-xl">
                                        {link.title}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {modalOn && <Modal setModalOn={closeModal} />}
                <div className="flex items-center mt-8 gap-2 md:text-sm">
                    {socialsData &&
                        socialsData.map((social) => (
                            <a
                                key={social.id_socials}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer hover:scale-110 transition-all duration-75"
                            >
                                {social.title === "Instagram" ? (
                                    <InstagramIcon href={social.url} />
                                ) : social.title === "Tiktok" ? (
                                    <TiktokIcon href={social.url} />
                                ) : social.title === "Facebook" ? (
                                    <FacebookIcon href={social.url} />
                                ) : social.title === "X" ? (
                                    <XIcon href={social.url} />
                                ) : social.title === "Linkedin" ? (
                                    <LinkedinIcon href={social.url} />
                                ) : null}
                            </a>
                        ))}
                </div>
                <h6 className="mt-10 mb-5 font-semibold font-monstserrat text-sm">
                    © {currentYear} BPJS Kesehatan Subang.
                </h6>
            </div>
        </div>
    );
}

export default Home;
