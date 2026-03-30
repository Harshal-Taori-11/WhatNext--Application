import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { fetchSettings } from './store/slices/settingsSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardPage from './pages/BoardPage';
import AllTasksPage from './pages/AllTasksPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSettings());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/board" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/board" />}
      />

      <Route
        path="/board"
        element={isAuthenticated ? <BoardPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/tasks"
        element={isAuthenticated ? <AllTasksPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/notes"
        element={isAuthenticated ? <NotesPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/settings"
        element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
      />

      <Route path="/" element={<Navigate to={isAuthenticated ? '/board' : '/login'} />} />
    </Routes>
  );
};

export default App;
