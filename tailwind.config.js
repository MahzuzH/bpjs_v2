/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                monstserrat: ['"Montserrat"', "cursive"],
                poppins: ['"Poppins"'],
                calistoga: ['"Calistoga"'],
            },
        },
    },
    plugins: [],
};
