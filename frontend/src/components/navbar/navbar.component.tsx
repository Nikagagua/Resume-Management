import React, { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { ToggleButton } from "@mui/material";
import { Menu, LightMode, DarkMode } from "@mui/icons-material";
import { ThemeContext } from "../../context/theme.context";

const links = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Candidates", href: "/candidates" },
];

export const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    const toggleOpen = () => {
        setOpen((prevState) => !prevState);
    };

    const menuStyles = open ? "menu open" : "menu";

    return (
        <div className="navbar">
            <div className="brand">
                <span>Resume Management</span>
            </div>
            <div className={menuStyles}>
                <ul>
                    {links.map((link) => (
                        <li key={link.label} onClick={toggleOpen}>
                            <Link to={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="hamburger">
                <Menu onClick={toggleOpen} />
            </div>
            <div className="toggle">
                <ToggleButton value="check" selected={darkMode} onChange={toggleDarkMode}>
                    {darkMode ? <LightMode /> : <DarkMode />}
                </ToggleButton>
            </div>
        </div>
    );
};

export default Navbar;
