import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <h5 className="footer-title">Síguenos en nuestras redes sociales</h5>

                <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaFacebook className="social-icon" /> Facebook
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaInstagram className="social-icon" /> Instagram
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaYoutube className="social-icon" /> YouTube
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaTwitter className="social-icon" /> Twitter
                    </a>
                </div>

                <p className="copyright">&copy; {new Date().getFullYear()} <strong>SICHF</strong>. Todos los derechos reservados.</p>
            </div>

            <style jsx="true">{`
                .footer-container {
                    background: linear-gradient(135deg, #9370db 0%, #6a5acd 100%);
                    color: white;
                    padding: 3rem 1rem;
                    text-align: center;
                    position: relative;
                    z-index: 10;
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .footer-title {
                    font-size: 1.5rem;
                    margin-bottom: 2rem;
                    font-weight: 600;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
                }

                .social-links {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .social-link {
                    color: white;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .social-link:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-3px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .social-icon {
                    margin-right: 0.5rem;
                    font-size: 1.3rem;
                }

                .copyright {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    margin-top: 1rem;
                }

                strong {
                    font-weight: 700;
                    color: #e6e6fa;
                }

                @media (max-width: 768px) {
                    .social-links {
                        gap: 1rem;
                    }
                    
                    .social-link {
                        font-size: 1rem;
                        padding: 0.4rem 0.8rem;
                    }
                    
                    .footer-title {
                        font-size: 1.3rem;
                    }
                }

                @media (max-width: 480px) {
                    .social-links {
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;