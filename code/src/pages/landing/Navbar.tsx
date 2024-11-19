import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import Logo from "../../assets/logo.png";

const LanderNavbar = () => {
    return (
        <Navbar
            className="text-white border-b border-gray-800"
            maxWidth="full"
        >
            <div className="flex items-center gap-6">
                <NavbarBrand>
                    <Link to="/" className="flex items-start">
                        <div className="w-8 h-8">
                            <img
                                src={Logo}
                                alt="Logo"
                                className="w-full h-full"
                            />
                        </div>
                    </Link>
                </NavbarBrand>

                <NavbarContent className="hidden sm:flex" justify="start">
                    <NavbarItem>
                        <Link
                            to="/how-it-works"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            How it works
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            to="/sdsl"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            SDSL
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            to="/support"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Support
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            to="/about"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            About
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            </div>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button
                        as={Link}
                        to="/sign-in"
                        variant="light"
                        className="text-gray-300 hover:text-white"
                    >
                        Sign In
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        as={Link}
                        to="/sign-up"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};

export default LanderNavbar;