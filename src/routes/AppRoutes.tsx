import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from '../pages/WelcomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { HealthPage } from '../pages/HealthPage';
import { PregnancyPage } from '../pages/PregnancyPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { MedicationsPage } from '../pages/MedicationsPage';
import { AlertsPage } from '../pages/AlertsPage';
import { EmergencyPage } from '../pages/EmergencyPage';
import { ContactsPage } from '../pages/ContactsPage';
import { AshaContactPage } from '../pages/AshaContactPage';
import { HealthHistoryPage } from '../pages/HealthHistoryPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/health" element={<HealthPage />} />
      <Route path="/pregnancy" element={<PregnancyPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/medications" element={<MedicationsPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/emergency" element={<EmergencyPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/asha-contact" element={<AshaContactPage />} />
      <Route path="/history" element={<HealthHistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
