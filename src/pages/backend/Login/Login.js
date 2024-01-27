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
    const { setUser } = useUser();
    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    const handleLogin = async () => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select()
                .eq("email", email)
                .eq("password", password)
                .single();

            if (error) {
                throw error;
            }

            console.log("Login successful:", data);
            setUser(email); // Set user's email in the context
            navigate("/admin");
        } catch (error) {
            console.error("Login failed:", error.message);
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
        <div
            className="bg-gradient-primary d-flex align-items-center"
            style={{ height: "100vh", overflow: "hidden" }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div
                            className="card o-hidden border-0 shadow-lg my-5"
                            style={{ height: "50vh" }}
                        >
                            <div className="card-body h-max align-items-lg-stretch p-0">
                                <div className="row">
                                    <div
                                        className="col-lg-6 d-none d-lg-block bg-login-image rounded-xl py-60"
                                        style={{
                                            backgroundImage: `url('https://umsu.ac.id/artikel/wp-content/uploads/2023/09/penyakit-yang-tak-ditanggung-BPJS-kesehatan.jpg')`,
                                            backgroundSize: "contain",
                                        }}
                                    ></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center pt-16">
                                                <h1 className="h4 text-gray-900 mb-4">
                                                    Welcome Back!
                                                </h1>
                                            </div>
                                            <form
                                                className="email"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleLogin();
                                                }}
                                            >
                                                <div className="form-group">
                                                    <input
                                                        type="email"
                                                        className="form-control form-control-user"
                                                        id="exampleInputEmail"
                                                        aria-describedby="emailHelp"
                                                        placeholder="Enter Email Address..."
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <input
                                                            type={
                                                                showPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            className="form-control form-control-user"
                                                            id="exampleInputPassword"
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(e) =>
                                                                setPassword(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            onKeyPress={
                                                                handleKeyPress
                                                            }
                                                        />
                                                        <div className="input-group-append">
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                onClick={
                                                                    toggleShowPassword
                                                                }
                                                            >
                                                                {showPassword ? (
                                                                    <FiEyeOff
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <FiEye
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn bg-primary font-semibold text-white btn-user btn-block h-12"
                                                    onClick={handleLogin}
                                                >
                                                    Login
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
            <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
            <script src="js/sb-admin-2.min.js"></script>
        </div>
    );
}

export default Login;
