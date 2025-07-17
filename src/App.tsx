import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CalendarPage from './CalendarPage';
import LoginPage from './LoginPage';
import RezervasyonOlustur from './RezervasyonOlustur';
import React from 'react';
import MainLayout from './MainLayout';
import TumRezervasyonlar from './TumRezervasyonlar';
import './App.css';
import BilgiGirisi from './BilgiGirisi';
import RezervasyonDuzenle from './RezervasyonDuzenle';

const Rezervasyonlarim = React.lazy(() => import('./Rezervasyonlarim'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rezervasyon-olustur" element={<MainLayout><RezervasyonOlustur /></MainLayout>} />
        <Route path="/rezervasyonlarim" element={<MainLayout><React.Suspense fallback={<div>Yükleniyor...</div>}><Rezervasyonlarim /></React.Suspense></MainLayout>} />
        <Route path="/tum-rezervasyonlar" element={<MainLayout><TumRezervasyonlar /></MainLayout>} />
        <Route path="/bilgi-girisi" element={<MainLayout><BilgiGirisi /></MainLayout>} />
        <Route path="/rezervasyon-duzenle/:id" element={<MainLayout><RezervasyonDuzenle /></MainLayout>} />
        <Route path="/" element={<MainLayout><CalendarPage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
