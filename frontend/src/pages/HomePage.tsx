import React from 'react';
import { useNavigate } from 'react-router-dom';
import woerdenImage from '../assets/images/woerden.png';
import './HomePage.css';

interface TileData {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  color: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const tiles: TileData[] = [
    {
      id: 'roombooking',
      title: 'TVVL - Room Booking',
      description: 'Overzicht bezetting ruimtes',
      path: '/tvvl-roombooking',
      icon: '🏢',
      color: '#4F46E5'
    },
    {
      id: 'environmental',
      title: 'TVVL - Binnenklimaat',
      description: 'Bekijk binnenklimaat gegevens',
      path: '/tvvl-enviromental',
      icon: '🌱',
      color: '#059669'
    },
    {
      id: 'tvvl-energy',
      title: 'TVVL - Energie',
      description: 'Energie dashboard in TVVL style',
      path: '/tvvl-energy',
      icon: '⚡',
      color: '#DC2626'
    },
    {
      id: 'tn-energy',
      title: 'TN - Energie',
      description: 'Energie dashboard in TN style',
      path: '/tn-energy',
      icon: '🔋',
      color: '#7C3AED'
    }
  ];

  const handleTileClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="homepage">
      <div className="homepage-container">
        <header className="homepage-header">
          <h1>Korenmolenlaan 4, Woerden</h1>
          <p>Selecteer een applicatie om te starten</p>
        </header>
        
        <div className="homepage-content">
          <div className="homepage-image">
            <img src={woerdenImage} alt="Woerden" className="woerden-image" />
          </div>
          
          <div className="tiles-section">
            <div className="tiles-grid">
              {tiles.map((tile) => (
                <div
                  key={tile.id}
                  className="tile"
                  onClick={() => handleTileClick(tile.path)}
                  style={{ '--tile-color': tile.color } as React.CSSProperties}
                >
                  <div className="tile-icon">
                    {tile.icon}
                  </div>
                  <div className="tile-content">
                    <h3 className="tile-title">{tile.title}</h3>
                    <p className="tile-description">{tile.description}</p>
                  </div>
                  <div className="tile-arrow">
                    →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <footer className="homepage-footer">
          <p>&copy; 2025 - Vink Technology Consultancy</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;