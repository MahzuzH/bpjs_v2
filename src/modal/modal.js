const Modal = ({ setModalOn, setChoice }) => {
    const handleClick = () => {
        setModalOn(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75">
            <div className="flex h-screen justify-center items-center">
                <div className="flex-col justify-center bg-white py-12 px-24 border-4 rounded-xl relative">
                    <button
                        onClick={handleClick}
                        className="absolute top-2 right-4 font-bold font-monstserrat text-xl text-gray-600 hover:text-red-600"
                    >
                        X
                    </button>
                    <div className="flex items-center justify-center text-xl text-zinc-600 mb-10 font-poppins">
                        Choose platform
                    </div>

                    <div className="flex flex-row gap-5">
                        <a
                            href="https://play.google.com/store/apps/details?id=app.bpjs.mobile&hl=en&gl=US"
                            onClick={handleClick}
                            className="px-4 py-2 border-2 border-white hover:border-zinc-500 hover:scale-110 hover:transition-all"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                className="rounded-lg"
                                alt="andro"
                                src="https://static.vecteezy.com/system/resources/previews/022/613/026/large_2x/google-play-store-icon-logo-symbol-free-png.png"
                                width={64}
                                height={64}
                            ></img>
                        </a>
                        <a
                            href="https://apps.apple.com/id/app/mobile-jkn/id1237601115"
                            onClick={handleClick}
                            className="px-4 py-2 border-2 border-white hover:border-zinc-500 hover:scale-105 hover:transition-all"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                className="rounded-lg"
                                alt="ios"
                                src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg"
                                width={64}
                                height={64}
                            ></img>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
