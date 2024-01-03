import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/mobileRoutes/Home';
import LandingPage from './routes/mobileRoutes/LandingPage';
import DocBotPage from './routes/mobileRoutes/DocBotPage';
import HelpPage from './routes/HelpPage';
import About from './routes/About';
import LoginPage from './routes/mobileRoutes/LoginPage';
import PatientDetails from './routes/PatientDetails';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthContextProvider } from './components/auth/AuthContext';
import ViewProfile from './routes/mobileRoutes/ViewProfile';
import ViewPatientScreen from './routes/ViewPatientScreen';
import ViewTest from './routes/ViewTest';
import GPDetailsPage from './routes/mobileRoutes/GPDetailsPage';
import InsuranceDetailsPage from './routes/mobileRoutes/InsuranceDetailsPage';
import PlanSelectionPage from './routes/mobileRoutes/PlanSelectionPage';
import Checkout from './routes/mobileRoutes/checkout';
import ReviewPage from './routes/mobileRoutes/ReviewPage';

function main() {
  return (
    <AuthContextProvider>
      <Router>
        <div>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<ProtectedRoute component={Home} />} />
            <Route path="/docBot" element={<DocBotPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/details" element={<PatientDetails />} />
            <Route path="/viewProfile" element={<ViewProfile />} />
            <Route
              path="/viewPatientDetails/:patID"
              element={<ViewPatientScreen />}
            />
            <Route
              path="/viewPatientDetails/:patID/test/:testDate"
              element={<ViewTest />}
            />
            <Route path="/mobileGPDetails" element={<GPDetailsPage />} />
            <Route
              path="/mobileInsuranceDetails"
              element={<InsuranceDetailsPage />}
            />
            <Route
              path="/mobilePlanSelection"
              element={<PlanSelectionPage />}
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/mobileReview" element={<ReviewPage />} />
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default main;
