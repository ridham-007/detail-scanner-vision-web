import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAnalytics } from './utils/analytics'

// Initialize analytics with stored Amplitude key if available
const storedAmplitudeKey = localStorage.getItem('amplitude_api_key');
initAnalytics(storedAmplitudeKey || undefined);

createRoot(document.getElementById("root")!).render(<App />);
