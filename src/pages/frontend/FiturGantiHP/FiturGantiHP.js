import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const FiturGantiHP = () => {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newNoHp, setNewNoHp] = useState("");
    const [data, setData] = useState([]);
    const supabase = createClient(
        process.env.REACT_APP_SUPABASE_PROJ_URL,
        process.env.REACT_APP_SUPABASE_PROJ_KEY
    );

    const fetchData = async () => {
        try {
            const { data: fetchedData, error } = await supabase
                .from("users")
                .select("*");

            if (error) throw error;

            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
        document.title = "Fitur Ganti HP";
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Form Pergantian Nomor HP</h2>
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>NIK</th>
                        <th>No. JKN</th>
                        <th>Nama</th>
                        <th>Segmen</th>
                        <th>No. HP</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.nik}</td>
                            <td>{u.no_jkn}</td>
                            <td>{u.nama}</td>
                            <td>{u.segmen}</td>
                            <td>
                                {editingId === u.id ? (
                                    <input
                                        type="text"
                                        value={newNoHp}
                                        onChange={(e) =>
                                            setNewNoHp(e.target.value)
                                        }
                                    />
                                ) : (
                                    u.no_hp
                                )}
                            </td>
                            <td>
                                {editingId === u.id ? (
                                    <button onClick={() => handleSave(u.id)}>
                                        Simpan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingId(u.id);
                                            setNewNoHp(u.no_hp);
                                        }}
                                    >
                                        Ganti No HP
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FiturGantiHP;
