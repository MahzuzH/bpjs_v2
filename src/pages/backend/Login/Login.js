import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useUser } from "./UserContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setUser } = useUser();
    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    const handleLogin = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("admins")
                .select()
                .eq("email", email)
                .eq("password", password)
                .single();

            if (error) {
                throw error;
            }

            console.log("Login successful:", data);
            setUser(email);
            navigate("/admin");
        } catch (error) {
            setError("Invalid email or password");
            console.error("Login failed:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Ganti Nomor HP</h2>
            <form onSubmit={handleSubmit}>
                {/* Step 1: Shipping Address */}
                <div className="space-y-4 mb-6">
                    <div className="text-lg font-medium">Data Pengguna</div>

                    {/* NIK and No. JKN */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">
                                NIK *
                            </label>
                            <input
                                type="text"
                                name="nik"
                                value={formData.nik}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">
                                No. JKN *
                            </label>
                            <input
                                type="text"
                                name="no_jkn"
                                value={formData.no_jkn}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    {/* Nama and Segmen */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">
                                Nama *
                            </label>
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">
                                Segmen *
                            </label>
                            <input
                                type="text"
                                name="segmen"
                                value={formData.segmen}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    {/* No HP */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Nomor HP Baru *
                        </label>
                        <input
                            type="text"
                            name="no_hp"
                            value={formData.no_hp}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                {/* Step 2: Review Your Info */}
                <div className="flex justify-between mb-6">
                    <span className="font-medium text-gray-700">
                        Periksa kembali data Anda
                    </span>
                    <div className="text-sm text-gray-600">
                        Segmen: {formData.segmen}
                    </div>
                </div>

                {/* Step 3: Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md"
                    >
                        Ganti Nomor HP
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
