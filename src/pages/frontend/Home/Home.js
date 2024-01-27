import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import XIcon from "../icon/XIcon";
import LinkedinIcon from "../icon/LinkdeinIcon";
import InstagramIcon from "../icon/InstagramIcon";
import TiktokIcon from "../icon/TiktokIcon";
import FacebookIcon from "../icon/FacebookIcon";
import Modal from "../modal/modal";
import "../Home/Home.css";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_PROJ_URL,
    process.env.REACT_APP_SUPABASE_PROJ_KEY
);
function Home() {
    const [modalOn, setModalOn] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [socials, setSocials] = useState([]);

    const openModal = () => {
        setModalOn(true);
    };

    const closeModal = () => {
        setModalOn(false);
    };

    const handleLinkClick = (link) => {
        link.isModal ? openModal() : window.open(link.url, "_blank");
    };

    const fetchData = async (tableName, setDataFunction) => {
        setLoading(true);
        try {
            const data = await supabase.from(tableName).select().order("id");
            setDataFunction(data.data);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentYear(new Date().getFullYear());
        }, 1000);

        const fetchDataForTables = async () => {
            await Promise.all([
                fetchData("profiles", setProfiles),
                fetchData("links", setLinks),
                fetchData("socials", setSocials),
            ]);
        };

        fetchDataForTables();
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="App">
            <div className="container flex items-center text-center flex-col justify-center mx-auto lg:px-36 md:px-4 ">
                {profiles &&
                    profiles.map((profile) => (
                        <div
                            key={profile.id}
                            className="flex flex-col items-center justify-center"
                        >
                            <img
                                src={profile.avatar}
                                className="mb-4 mt-16"
                                alt="logo"
                                width={96}
                                height={96}
                            />
                            <h1 className="font-bold mt-4 text-base text-black font-poppins md:text-lg lg:text-xl">
                                {profile.name}
                            </h1>
                            <h2 className="px-8 mb-8 text-sm text-black font-monstserrat font-semibold md:text-base lg:text-lg">
                                {profile.title}
                            </h2>
                        </div>
                    ))}
                {loading ? (
                    <p>Please wait while link ready...</p>
                ) : (
                    <ul className="flex flex-col w-full lg:w-4/5">
                        {links &&
                            links.map((link) => (
                                <li
                                    key={link.id}
                                    className="cursor-pointer rounded-xl m-2 p-1 hover:scale-105 transition-all bg-gray-100 border-blue-900 border-4"
                                >
                                    <div
                                        className="flex items-center"
                                        onClick={() => handleLinkClick(link)}
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
                    {socials &&
                        socials.map((social) => (
                            <a
                                key={social.id} // Ganti dengan key yang unik seperti link.title
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer hover:scale-110 transition-all duration-75"
                            >
                                {social.title === "Instagram" ? (
                                    <InstagramIcon href={social.href} />
                                ) : social.title === "Tiktok" ? (
                                    <TiktokIcon href={social.href} />
                                ) : social.title === "Facebook" ? (
                                    <FacebookIcon href={social.href} />
                                ) : social.title === "X" ? (
                                    <XIcon href={social.href} />
                                ) : social.title === "Linkedin" ? (
                                    <LinkedinIcon href={social.href} />
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
