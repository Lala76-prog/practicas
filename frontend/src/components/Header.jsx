import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Login from './buttons/Login';
import Signup from './buttons/Signup';  // Fixed import name
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header-container">
            <nav className="navbar">
                <div className="nav-container">
                    {/* Logo/Brand */}
                    <NavLink to="/" className="brand">
                        SICHF
                    </NavLink>
                    
                    {/* Menú para móvil */}
                    <button className="mobile-menu-button" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes className="menu-icon" /> : <FaBars className="menu-icon" />}
                    </button>
                    
                    {/* Menú principal */}
                    <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                        <ul className="nav-list">
                            <li className="nav-item">
                                <NavLink 
                                    to="/" 
                                    className={({ isActive }) => 
                                        `nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    to="/products" 
                                    className={({ isActive }) => 
                                        `nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Productos
                                </NavLink>
                            </li>
                        </ul>
                        
                        <div className="nav-actions">
                            <div className="custom-button-container">
                                <Login />
                            </div>
                            <div className="custom-button-container">
                                <Signup />  {/* Fixed component name */}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <style jsx="true">{`
                .header-container {
                    background: linear-gradient(135deg, #6a5acd 0%, #483d8b 100%);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    width: 100%;
                }
                
                .navbar {
                    padding: 0.8rem 2rem;
                }
                
                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                }
                
                .brand {
                    color: white;
                    font-size: 1.8rem;
                    font-weight: 700;
                    text-decoration: none;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                }
                
                .brand:hover {
                    color: #e6e6fa;
                    transform: scale(1.05);
                }
                
                .mobile-menu-button {
                    display: none;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                }
                
                .nav-menu {
                    display: flex;
                    align-items: center;
                }
                
                .nav-list {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                
                .nav-item {
                    margin: 0 1rem;
                }
                
                .nav-link {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 1.1rem;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .nav-link.active {
                    background: rgba(255, 255, 255, 0.2);
                    font-weight: 600;
                }
                
                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    background: #e6e6fa;
                    border-radius: 50%;
                }
                
                .nav-actions {
                    display: flex;
                    align-items: center;
                    margin-left: 2rem;
                    gap: 1rem;
                }

                .custom-button-container :global(button) {
                    background-color: #2d2d2d !important;
                    color: white !important;
                    border: none !important;
                    padding: 0.5rem 1rem !important;
                    border-radius: 4px !important;
                    font-weight: 500 !important;
                    transition: all 0.3s ease !important;
                }

                .custom-button-container :global(button:hover) {
                    background-color: #1a1a1a !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                }

                .custom-button-container :global(button:active) {
                    transform: translateY(0) !important;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .navbar {
                        padding: 0.8rem 1.5rem;
                    }
                    
                    .mobile-menu-button {
                        display: block;
                    }
                    
                    .nav-menu {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        width: 100%;
                        background: linear-gradient(135deg, #6a5acd 0%, #483d8b 100%);
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 1rem 2rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        display: none;
                    }
                    
                    .nav-menu.open {
                        display: flex;
                    }
                    
                    .nav-list {
                        flex-direction: column;
                        width: 100%;
                    }
                    
                    .nav-item {
                        margin: 0.5rem 0;
                    }
                    
                    .nav-actions {
                        margin: 1rem 0 0;
                        width: 100%;
                        justify-content: flex-start;
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .custom-button-container {
                        width: 100%;
                    }

                    .custom-button-container :global(button) {
                        width: 100%;
                        padding: 0.75rem !important;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;