import React, { useEffect, useState } from 'react';
import './Home.css';
import { FaShoePrints } from 'react-icons/fa';

const Home = () => {
  const [showHappyFeets, setShowHappyFeets] = useState(false);
  const [lettersAnimated, setLettersAnimated] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setLettersAnimated(true);
    }, 300);

    const handleScroll = () => {
      const shouldShow = window.scrollY > 50 || window.innerHeight === window.scrollHeight;
      setShowHappyFeets(shouldShow);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(animationTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="home-container">
      <div className="minimal-container">
        <div className="sichf-animation">
          {['S', 'I', 'C', 'H', 'F'].map((letter, index) => (
            <span 
              key={index}
              className={`sichf-letter ${lettersAnimated ? 'animate' : ''}`}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      <div className={`happy-feets-section ${showHappyFeets ? 'visible' : ''}`}>
        <div className="happy-feets-content">
          <div className="shoe-logo">
            <FaShoePrints className="shoe-icon" />
          </div>
          <div className="happy-feets-text">
            <h2>Happy Feets</h2>
            <p>Una tienda de calzado que se especializa en ofrecer una variedad de zapatos para diferentes estilos y necesidades</p>
          </div>
        </div>
      </div>
      <footer></footer>
    </div>
  );
};

export default Home;