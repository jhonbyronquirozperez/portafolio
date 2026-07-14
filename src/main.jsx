import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';

// Nota: sin StrictMode a propósito. En desarrollo StrictMode monta y
// desmonta cada efecto dos veces, lo que reinicializaría el contexto WebGL
// de Three.js y reproduciría la animación de entrada de GSAP. El cleanup
// está bien implementado, pero para un portafolio preferimos un arranque
// limpio y predecible.
createRoot(document.getElementById('root')).render(<App />);
