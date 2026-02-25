// src/app/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Login } from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import UserPage from './components/UserPage';
import DevicePage from './components/DevicePage';
import ProjectPage from './components/ProjectPage';
import AuthListener from "./components/AuthListener";
import RootRedirect from "./components/page/RootRedirect";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <AuthListener>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/users" element={<UserPage />} />
              <Route path="/devices" element={<DevicePage />} />
              <Route path="/projects" element={<ProjectPage />} />
            </Route>
          </Routes>
        </AuthListener>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
