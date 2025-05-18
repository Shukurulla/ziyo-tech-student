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

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("ziyo-jwt")) navigate("/auth/login");
  }, []);
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/auth/sign" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/"
          element={<Layout active={"Bosh Sahifa"} activePage={<Dashboard />} />}
        />
        <Route
          path="/practicum-tests"
          element={
            <Layout active={"Praktik testlar"} activePage={<PracticTests />} />
          }
        />
        <Route
          path="/ai-chat"
          element={<Layout active={"AI Chat"} activePage={<AiChat />} />}
        />
        <Route
          path="/materials"
          element={
            <Layout active={"Materiyallar"} activePage={<Materials />} />
          }
        />
        <Route
          path="/glossary"
          element={<Layout active={"Glossary"} activePage={<GlossaryPage />} />}
        />
        <Route
          path="/settings"
          element={
            <Layout active={"Sozlamalar"} activePage={<EditProfile />} />
          }
        />
        <Route
          path="/video/:id"
          element={<Layout active={"Bosh Sahifa"} activePage={<Video />} />}
        />
        <Route
          path="/video/:videoId/test"
          element={<Layout active={"Bosh Sahifa"} activePage={<TestPage />} />}
        />
        <Route
          path="/practicum-test/:testId"
          element={
            <Layout active={"Praktik testlar"} activePage={<PracticeTest />} />
          }
        />
        <Route
          path="/notification"
          element={
            <Layout active={"Xabarlar"} activePage={<StudentNotifications />} />
          }
        />
        <Route
          path="/video/:videoId/test-selection"
          element={
            <Layout
              active={"Bosh Sahifa"}
              activePage={<StudentTestSelection />}
            />
          }
        />
        <Route
          path="/video/:videoId/matching-test"
          element={
            <Layout active={"Bosh Sahifa"} activePage={<MatchingTestPage />} />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
