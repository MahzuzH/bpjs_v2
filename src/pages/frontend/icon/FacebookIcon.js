import React from "react";

function FacebookIcon({ href }) {
    return (
        <button href={href} target="_blank" rel="noopener noreferrer">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-brand-facebook"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path>
            </svg>
        </button>
    );
}

export default FacebookIcon;
