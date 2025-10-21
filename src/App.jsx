import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/layout";
import Dashboard from "./pages/dashboard";
import PracticTests from "./pages/practicTests";
import AiChat from "./pages/aiChat";
import Materials from "./pages/materials";
import GlossaryPage from "./pages/glossary";
import Video from "./pages/video";
import TestPage from "./pages/testPage";
import PracticeTest from "./pages/practiceDetail";
import StudentNotifications from "./pages/notification";
import EditProfile from "./pages/settings";
import StudentTestSelection from "./pages/StudentTestSelection";
import MatchingTestPage from "./pages/MatchingTestPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/auth/sign" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout active={"Bosh Sahifa"} activePage={<Dashboard />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practicum-tests"
          element={
            <ProtectedRoute>
              <Layout
                active={"Praktik testlar"}
                activePage={<PracticTests />}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <Layout active={"AI Chat"} activePage={<AiChat />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials"
          element={
            <ProtectedRoute>
              <Layout active={"Materiyallar"} activePage={<Materials />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/glossary"
          element={
            <ProtectedRoute>
              <Layout active={"Glossary"} activePage={<GlossaryPage />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout active={"Sozlamalar"} activePage={<EditProfile />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <Layout active={"Bosh Sahifa"} activePage={<Video />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:videoId/test"
          element={
            <ProtectedRoute>
              <Layout active={"Bosh Sahifa"} activePage={<TestPage />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practicum-test/:testId"
          element={
            <ProtectedRoute>
              <Layout
                active={"Praktik testlar"}
                activePage={<PracticeTest />}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Layout
                active={"Xabarlar"}
                activePage={<StudentNotifications />}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:videoId/test-selection"
          element={
            <ProtectedRoute>
              <Layout
                active={"Bosh Sahifa"}
                activePage={<StudentTestSelection />}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:videoId/matching-test"
          element={
            <ProtectedRoute>
              <Layout
                active={"Bosh Sahifa"}
                activePage={<MatchingTestPage />}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
