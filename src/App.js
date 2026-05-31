import React, { useState } from 'react';
import './App.css';
import Formulario from './components/Formulario';
import Informe from './components/Informe';

const ESTIMATE_URL = process.env.REACT_APP_ESTIMATE_URL || 'http://localhost:5000/estimate';
const REPORT_URL = process.env.REACT_APP_REPORT_URL || 'http://localhost:5000/report';

function LogoSECC({ color = 'white', size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="14" stroke={color} strokeWidth="3" fill="none"/>
      <line x1="29" y1="29" x2="41" y2="41" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
      <text x="19" y="23" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold" fontFamily="Segoe UI, sans-serif">SECC</text>
    </svg>
  );
}

function App() {
  const [pantalla, setPantalla] = useState('formulario');
  const [informe, setInforme] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleEstimar = async (datos) => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(ESTIMATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al estimar');
      setInforme(result);
      setPantalla('informe');
    } catch (err) {
      setError(err.message === 'Failed to fetch'
        ? 'No se pudo conectar con el servidor. Asegurate de que el sistema este activo e intenta nuevamente.'
        : err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleNuevaEstimacion = () => {
    setInforme(null);
    setError(null);
    setPantalla('formulario');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <LogoSECC color="#1E7C3A" size={52} />
          <div className="header-titles">
            <h1>SECC</h1>
            <span className="header-sub">Sistema de Evaluación de Costos en AWS</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {pantalla === 'formulario' && (
          <Formulario
            onEstimar={handleEstimar}
            cargando={cargando}
            error={error}
            LogoSECC={LogoSECC}
          />
        )}
        {pantalla === 'informe' && (
          <Informe
            informe={informe}
            onNuevaEstimacion={handleNuevaEstimacion}
            reportUrl={REPORT_URL}
            LogoSECC={LogoSECC}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 SECC — Sistema de Estimación de Costos en Cloud</p>
      </footer>
    </div>
  );
}

export default App;