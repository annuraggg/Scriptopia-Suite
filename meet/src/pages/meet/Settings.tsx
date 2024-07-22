const Settings = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`${
        isOpen ? " translate-x-0" : "translate-x-[110%]"
      } duration-300 bg-red-500  border translate-all animate__animated overflow-y-hidden rounded-xl absolute right-5 h-full bg-card p-3 w-[350px]`}
    >
      Settings
    </div>
  );
};

export default Settings;
