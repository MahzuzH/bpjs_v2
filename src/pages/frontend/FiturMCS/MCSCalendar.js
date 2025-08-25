// src/pages/frontend/FiturMCS/MCSCalendar.js
import React, { useEffect, useMemo, useState } from "react";
import supabase from "../../../lib/supabaseClient";
import mcsIcon from "../../../lib/mcsicon.png"; // ikon di sidebar/about
import mcsBadgeIcon from "../../../lib/const.png"; // ikon yang mengisi penuh kotak tanggal

/* ================= Inline SVG Icons ================= */
const IconChevronLeft = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M15 19L8 12l7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
const IconChevronRight = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
const IconClock = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M12 8v5l3 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
);
const IconMapPin = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M12 22s7-5.33 7-12a7 7 0 10-14 0c0 6.67 7 12 7 12z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
);

/* ================= Helpers tanggal ================= */
const toISO = (d) =>
    [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
    ].join("-");

const monthRangeISO = (d) => {
    const y = d.getFullYear();
    const m = d.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    return [toISO(start), toISO(end)];
};

/* ================== Component ================== */
const MCSCalendar = ({
    events = [],
    initialDate,
    useSupabase = false,
    tableName = "mcs_events",
    aboutTitle = "Mobile Customer Service (MCS)",
    aboutText = "Layanan jemput bola BPJS Kesehatan yang hadir di lokasi-lokasi tertentu pada hari/tanggal tertentu. Melayani pendaftaran, perubahan data, informasi kepesertaan, hingga layanan administrasi lain tanpa perlu ke kantor cabang.",
}) => {
    const [viewDate, setViewDate] = useState(initialDate ?? new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [activeDate, setActiveDate] = useState(null);
    const [remoteEvents, setRemoteEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const shouldUseRemote = useSupabase && !!supabase;
    const sourceEvents = shouldUseRemote ? remoteEvents : events;

    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1);
    const mondayFirstIndex = (firstDay.getDay() + 6) % 7;

    const eventsByDay = useMemo(() => {
        const map = new Map();
        for (const ev of sourceEvents) {
            if (!map.has(ev.date)) map.set(ev.date, []);
            map.get(ev.date).push(ev);
        }
        return map;
    }, [sourceEvents]);

    const isToday = (d) => {
        const now = new Date();
        return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate()
        );
    };

    const openDay = (dayNum) => {
        const d = new Date(y, m, dayNum);
        const key = toISO(d);
        const todaysEvents = eventsByDay.get(key) ?? [];
        if (todaysEvents.length === 0) return;
        setActiveDate(d);
        setModalOpen(true);
    };

    const monthLabel = new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
    }).format(viewDate);
    const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

    /* ============ Fetch Supabase ============ */
    useEffect(() => {
        let ignore = false;
        const fetchMonth = async () => {
            if (!shouldUseRemote) return;
            setLoading(true);
            try {
                const [startISO, endISO] = monthRangeISO(viewDate);
                const { data, error } = await supabase
                    .from(tableName)
                    .select(
                        "id_jadwalmcs_int, event_date, title, start_time, end_time, location"
                    )
                    .gte("event_date", startISO)
                    .lte("event_date", endISO)
                    .order("event_date", { ascending: true })
                    .order("start_time", { ascending: true });

                if (error) throw error;

                const mapped = (data || []).map((row) => ({
                    id: row.id_jadwalmcs_int,
                    date: row.event_date,
                    title: row.title || "Layanan MCS",
                    startTime: row.start_time?.slice(0, 5) || "",
                    endTime: row.end_time
                        ? row.end_time.slice(0, 5)
                        : undefined,
                    location: row.location || "",
                }));

                if (!ignore) setRemoteEvents(mapped);
            } catch (err) {
                console.error(
                    "[MCSCalendar] Supabase fetch error:",
                    err?.message || err
                );
                if (!ignore) setRemoteEvents([]);
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        fetchMonth();
        return () => {
            ignore = true;
        };
    }, [viewDate, shouldUseRemote, tableName]);

    /* ============ Calendar cells ============ */
    const leadingBlanks = Array.from({ length: mondayFirstIndex }, (_, i) => (
        <div key={`lead-${i}`} className="h-12" />
    ));

    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNum = i + 1;
        const d = new Date(y, m, dayNum);
        const key = toISO(d);
        const hasEvents = (eventsByDay.get(key) ?? []).length > 0;
        const today = isToday(d);

        return (
            <button
                key={key}
                disabled={!hasEvents}
                onClick={() => hasEvents && openDay(dayNum)}
                className={[
                    "relative flex items-start justify-center rounded-xl px-1.5 py-1.5 transition h-12 overflow-hidden",
                    hasEvents
                        ? "ring-1 ring-teal-600/20 bg-teal-50/50 cursor-pointer active:scale-[0.98] " +
                          "hover:scale-105 hover:shadow-lg hover:ring-teal-400"
                        : "cursor-default opacity-70",
                    today
                        ? "outline outline-2 outline-offset-0 outline-teal-500"
                        : "",
                ].join(" ")}
                aria-label={`Tanggal ${dayNum} ${monthLabel}${
                    hasEvents ? ", ada jadwal MCS" : ""
                }`}
            >
                {/* Background ikon memenuhi kotak saat ada event */}
                {hasEvents && (
                    <img
                        src={mcsBadgeIcon}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Angka tanggal di atas ikon */}
                <span className="relative z-10 text-[12px] font-semibold leading-none bg-white/70 rounded px-1">
                    {dayNum}
                </span>
            </button>
        );
    });

    const totalCells = mondayFirstIndex + daysInMonth;
    const trailingNeeded = (7 - (totalCells % 7)) % 7;
    const trailingBlanks = Array.from({ length: trailingNeeded }, (_, i) => (
        <div key={`trail-${i}`} className="h-12" />
    ));

    const closeModal = () => setModalOpen(false);
    const activeEvents = activeDate
        ? eventsByDay.get(toISO(activeDate)) ?? []
        : [];

    /* ============ Layout (center screen) ============ */
    return (
        <div className="min-h-screen w-full bg-blue-100 flex items-center justify-center">
            <div className="w-full h-full max-w-7xl flex items-center justify-center p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-6 w-full h-full">
                    {/* Sidebar MCS */}
                    <aside className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 p-4 sm:p-5 flex flex-col justify-center">
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={mcsIcon}
                                alt="Ikon MCS"
                                className="w-36 h-36 object-contain mb-3 drop-shadow-sm rounded-xl"
                            />
                            <h2 className="text-base font-semibold tracking-tighter font-monstserrat text-black">
                                {aboutTitle}
                            </h2>
                            <p className="mt-2 text-sm text-black leading-relaxed font-poppins text-justify">
                                {aboutText}
                            </p>
                        </div>
                    </aside>

                    {/* Kalender */}
                    <section className="rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 p-4 sm:p-5 flex flex-col justify-center">
                        {/* Header bulan */}
                        <div className="flex items-center justify-between mb-2 text-black font-monstserrat">
                            <button
                                type="button"
                                className="h-9 w-9 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center"
                                onClick={() =>
                                    setViewDate(
                                        (d) =>
                                            new Date(
                                                d.getFullYear(),
                                                d.getMonth() - 1,
                                                1
                                            )
                                    )
                                }
                                aria-label="Bulan sebelumnya"
                            >
                                <IconChevronLeft className="h-5 w-5" />
                            </button>
                            <div className="text-base font-semibold tracking-tight">
                                {monthLabel.charAt(0).toUpperCase() +
                                    monthLabel.slice(1)}
                            </div>
                            <button
                                type="button"
                                className="h-9 w-9 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center"
                                onClick={() =>
                                    setViewDate(
                                        (d) =>
                                            new Date(
                                                d.getFullYear(),
                                                d.getMonth() + 1,
                                                1
                                            )
                                    )
                                }
                                aria-label="Bulan berikutnya"
                            >
                                <IconChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Label hari */}
                        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-black font-monstserrat">
                            {weekdays.map((w) => (
                                <div key={w} className="py-1">
                                    {w}
                                </div>
                            ))}
                        </div>

                        {/* Grid kalender */}
                        <div className="grid grid-cols-7 gap-y-1 rounded-2xl bg-white p-2 shadow-sm text-black font-poppins flex-grow">
                            {leadingBlanks}
                            {dayCells}
                            {trailingBlanks}
                        </div>

                        {shouldUseRemote && (
                            <div className="mt-2 text-[11px] text-black">
                                {loading
                                    ? "Memuat jadwal dari server…"
                                    : "Data tersinkron per-bulan."}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Modal detail event */}
            {modalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-end sm:items-center sm:justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeModal}
                        aria-hidden="true"
                    />
                    <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
                        <div className="mb-2">
                            <div className="text-base font-semibold font-monstserrat text-black">
                                Jadwal MCS –{" "}
                                {activeDate &&
                                    activeDate.toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                            </div>
                            <p className="text-xs text-gray-600 font-poppins">
                                Informasi waktu dan lokasi layanan Mobile
                                Customer Service.
                            </p>
                        </div>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                            {activeEvents.map((ev) => (
                                <div
                                    key={ev.id}
                                    className="rounded-2xl border p-3 flex items-start gap-3"
                                >
                                    <IconClock className="h-5 w-5 mt-0.5" />
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-black font-poppins">
                                            {ev.title ?? "Layanan MCS"}
                                        </div>
                                        <div className="text-sm font-poppins text-black">
                                            {ev.startTime}
                                            {ev.endTime
                                                ? `–${ev.endTime}`
                                                : ""}{" "}
                                            WIB
                                        </div>
                                        <div className="mt-1.5 flex items-start gap-2 text-sm">
                                            <IconMapPin className="h-5 w-5 mt-0.5" />
                                            {/* 🔗 klik lokasi -> buka Google Maps */}
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                    ev.location
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="leading-snug text-black font-poppins hover:underline"
                                            >
                                                {ev.location}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activeEvents.length === 0 && (
                                <div className="text-sm text-gray-500">
                                    Tidak ada jadwal MCS pada tanggal ini.
                                </div>
                            )}
                        </div>

                        <div className="pt-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-full rounded-xl bg-teal-600 text-white text-sm font-semibold py-2.5 hover:bg-teal-700 active:bg-teal-800"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MCSCalendar;
