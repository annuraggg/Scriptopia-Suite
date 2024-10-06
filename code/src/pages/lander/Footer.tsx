const Footer = () => {
  return (
    <div className="flex justify-center items-center py-10 px-48 flex-col">
      <h1 className="font-neue font-extrabold drop-shadow-glow text-7xl text-center">
        YOU CAN'T SCROLL ANYMORE. BETTER GO {"<CODE/>"}.
      </h1>
      <button
        className="mt-20 py-2 px-5 text-white font-gloock cursor-pointer text-3xl hover:scale-125 transition-all duration-300"
        onClick={() => window.open("/dashboard")}
      >
        Enter Scriptopia
      </button>
    </div>
  );
};

export default Footer;
