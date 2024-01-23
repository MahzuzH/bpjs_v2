import React from "react";

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="sticky-footer bg-white">
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <span>© {currentYear} BPJS Kesehatan Subang.</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
