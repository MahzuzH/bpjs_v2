import React from "react";
import MCSCalendar from "./MCSCalendar";

export default function FiturMCSPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            {/* MCSCalendar akan fetch otomatis dari Supabase berdasarkan bulan aktif */}
            <MCSCalendar useSupabase={true} />
        </div>
    );
}
