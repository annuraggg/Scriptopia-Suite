import { Avatar } from "@nextui-org/react";

const User = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`h-full border flex items-center justify-center transition-all duration-700 rounded-xl bg-card ml-5 ${
        isOpen ? "w-[74vw]" : "w-full mr-5"
      }`}
    >
      <Avatar size="lg" className="h-20 w-20" />
    </div>
  );
};

export default User;
