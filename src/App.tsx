import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CalendarPage from './CalendarPage';
import LoginPage from './LoginPage';
import RezervasyonOlustur from './RezervasyonOlustur';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rezervasyon-olustur" element={<RezervasyonOlustur />} />
        <Route path="/" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
