const Chatbox = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`${
        isOpen ? " translate-x-0" : "translate-x-[110%]"
      } duration-300 bg-blue-500 border translate-all animate__animated overflow-y-hidden rounded-xl absolute right-5 h-full bg-card p-3 w-[350px]`}
    >
      Chat
    </div>
  );
};

export default Chatbox;
