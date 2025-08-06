import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const FiturGantiHP = () => {
    const [users, setUsers] = useState([]); // State for storing users
    const [newNoHp, setNewNoHp] = useState(""); // State for the new phone number
    const [nik, setNik] = useState(""); // State to store NIK input
    const [userData, setUserData] = useState({
        nik: "",
        no_jkn: "",
        nama: "",
        segmen: "",
        no_hp: "",
    }); // State for the user data to fill in the form fields
    const [dataFetched, setDataFetched] = useState(false); // Flag to track if data is fetched

    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    const navigate = useNavigate(); // Get access to navigate function

    // Function to fetch user data from Supabase
    const fetchData = async () => {
        const { data, error } = await supabase
            .from("users") // Use the 'users' table here
            .select();

        if (error) {
            console.error("Error fetching data:", error.message);
        } else {
            console.log("Fetched users data:", data); // Log the fetched data
            setUsers(data); // Set the fetched data into the state
        }
    };

    // Effect to fetch data when the component mounts
    useEffect(() => {
        fetchData();
        document.title = "Fitur Ganti HP"; // Set the page title
    }, []);

    // Function to handle NIK input change
    const handleNikChange = (e) => {
        // Only allow input up to 16 characters
        if (e.target.value.length <= 16) {
            setNik(e.target.value);
        }
        setDataFetched(false); // Reset dataFetched flag when user starts typing NIK
    };

    // Function to handle Enter key press (trigger Cek Data button click)
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleCekData(); // Trigger the Cek Data button functionality
        }
    };

    // Function to handle Cek Data button click
    const handleCekData = () => {
        if (nik.length !== 16) {
            alert("NIK harus terdiri dari 16 karakter!");
            return; // Don't proceed if NIK is not 16 characters
        }

        // Normalize input NIK and compare it with the users data
        const inputNik = nik.trim().toString(); // Convert to string and trim
        const user = users.find(
            (user) => user.nik.toString().trim() === inputNik
        ); // Convert user.nik to string

        if (user) {
            // Set the state with user data, including no_hp
            setUserData({
                nik: user.nik,
                no_jkn: user.no_jkn,
                nama: user.nama,
                segmen: user.segmen,
                no_hp: user.no_hp || "", // Make sure no_hp is set, fallback to empty string if undefined
            });
            setNewNoHp(user.no_hp || ""); // Set initial value of newNoHp to the current No. HP
            setDataFetched(true); // Set flag to true when data is found
        } else {
            // Clear user data if no match is found
            setUserData({
                nik: "",
                no_jkn: "",
                nama: "",
                segmen: "",
                no_hp: "",
            });
            setNewNoHp(""); // Reset newNoHp when no user is found
            setDataFetched(false); // Set flag to false when no data is found
            alert("NIK tidak ditemukan!");
        }
    };

    // Function to save the updated phone number after validation
    const handleSave = async () => {
        console.log("Saving data...");

        // Log the current value of `newNoHp` and `nik`
        console.log("New No. HP:", newNoHp);
        console.log("NIK:", nik);

        if (!newNoHp || !nik) {
            alert("No. HP or NIK is empty!");
            return; // Don't proceed if No. HP or NIK is empty
        }

        try {
            const { error } = await supabase
                .from("users")
                .update({ no_hp: newNoHp }) // Update the phone number
                .eq("nik", nik); // Match the user by NIK

            if (error) throw error;

            // Update the local users state
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.nik === nik ? { ...user, no_hp: newNoHp } : user
                )
            );
            alert("Nomor HP berhasil diperbarui!");

            // After successful update, navigate back to the initial page or home
            navigate("/"); // Navigate to home page or any other page you'd like
        } catch (error) {
            console.error("Error saving data:", error.message);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8 font-poppins">
            <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-6 text-center">
                    Form Pergantian Nomor HP
                </h2>

                {/* NIK Input */}
                <div className="mb-6">
                    <label className="block text-lg font-medium">
                        Masukkan NIK
                    </label>
                    <input
                        type="text"
                        value={nik}
                        onChange={handleNikChange}
                        onKeyDown={handleKeyDown} // Attach the onKeyDown event here
                        className="p-2 bg-gray-700 text-white rounded-md w-full"
                        placeholder="Masukkan NIK"
                        maxLength={16}
                    />
                </div>

                {/* Cek Data Button */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleCekData}
                        className="bg-green-600 text-white px-6 py-3 rounded-md w-full font-bold text-lg"
                    >
                        Cek Data
                    </button>
                </div>

                {/* Form Fields (will populate after NIK is entered and "Cek Data" is clicked) */}
                {dataFetched && (
                    <form>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-lg font-medium">
                                    NIK
                                </label>
                                <input
                                    type="text"
                                    value={userData.nik}
                                    readOnly
                                    className="p-2 bg-gray-700 text-white rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium">
                                    No. JKN
                                </label>
                                <input
                                    type="text"
                                    value={userData.no_jkn}
                                    readOnly
                                    className="p-2 bg-gray-700 text-white rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    value={userData.nama}
                                    readOnly
                                    className="p-2 bg-gray-700 text-white rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium">
                                    Segmen
                                </label>
                                <input
                                    type="text"
                                    value={userData.segmen}
                                    readOnly
                                    className="p-2 bg-gray-700 text-white rounded-md w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium">
                                    No. HP
                                </label>
                                <input
                                    type="text"
                                    value={newNoHp} // Bind to newNoHp state
                                    onChange={(e) => setNewNoHp(e.target.value)} // Update newNoHp state
                                    className="p-2 bg-gray-700 text-white rounded-md w-full"
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-6 py-3 rounded-md w-full text-lg font-bold"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FiturGantiHP;
