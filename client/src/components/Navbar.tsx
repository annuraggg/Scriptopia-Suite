import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";
import Logo from "../assets/logo1080_transparent_white_large.png";
import { Link, Button } from "@nextui-org/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  const links = [
    {
      path: "/problems",
      label: "Problems",
    },
    {
      path: "/assessments",
      label: "Assessments",
    },
  ];

  return (
    <>
      <div
        className={
          "px-5 sm:px-10 w-full h-[8vh] flex items-center justify-between sticky top-0 z-50 backdrop-filter backdrop-blur-lg"
        }
      >
        <div className="flex items-center gap-2 sm:gap-5">
          <img
            src={Logo}
            alt="logo"
            className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-5 cursor-pointer"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          />
          <p className="flex text-md sm:text-base duration-200 transition-all md:hidden">
            {" "}
            Scriptopia
          </p>
          {links.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="text-sm sm:text-base hover:text-blue-500 duration-200 transition-all hidden md:block"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-5">
          <div className="flex hidden md:block">
            <OrganizationSwitcher />
            <UserButton />
          </div>
          <div className="flex md:hidden" onClick={handleMenu}>
            {!showMenu ? <Menu size={24} /> : <X size={24} />}
          </div>
        </div>
      </div>
      <div
        className={
          !showMenu
            ? "fixed left-[-100] ease-in-out duration-400 hidden md:block"
            : "fixed relaive z-20 left-0 top-0 w-[100%] h-full border-r-gray-900 backdrop-blur-lg ease-in-out duration-400 md:hidden"
        }
      >
        <div className="flex flex-col items-center pt-20 h-full md:hidden">
          <div className="flex items-center pl-2 gap-2 sm:gap-5 border-1 border-gray-600 shadow-md md:hidden my-2  w-[80%] h-[8%] rounded-md justify-start">
            <UserButton />
            <OrganizationSwitcher />
          </div>
          {links.map((link) => (
            <Button
              key={link.path}
              href={link.path}
              className="flex text-md sm:text-base text-left border-1 border-gray-600 shadow-md md:hidden my-2  w-[80%] h-[8%] rounded-md justify-start"
              as={Link}
              color="primary"
              showAnchorIcon
              variant="ghost"
            >
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
