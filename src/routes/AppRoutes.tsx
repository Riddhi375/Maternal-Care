import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { GuidancePage } from '../pages/GuidancePage';
import { AshaDashboardPage } from '../pages/AshaDashboardPage';
import { DoctorDashboardPage } from '../pages/DoctorDashboardPage';
import { FamilyDashboardPage } from '../pages/FamilyDashboardPage';
import { HospitalReferralPage } from '../pages/HospitalReferralPage';
import { ConsultationPage } from '../pages/ConsultationPage';
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

      {/* New Module Pages */}
      <Route path="/guidance" element={<GuidancePage />} />
      <Route path="/asha-dashboard" element={<AshaDashboardPage />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
      <Route path="/family-dashboard" element={<FamilyDashboardPage />} />
      <Route path="/hospital-referral" element={<HospitalReferralPage />} />
      <Route path="/consultations" element={<ConsultationPage />} />

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
