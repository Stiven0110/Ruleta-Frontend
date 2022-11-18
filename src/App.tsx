import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { Draw, Home } from './views';
import { AuthContext } from './context/fakeAuthContext';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/awards"
          element={
            <RequireAuth>
              <Draw />
            </RequireAuth>
          }
        />
        <Route path="*" element={
          <h1>
            no existe la ruta
          </h1>
        } />

      </Routes>
    </BrowserRouter>
  )
}
function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useContext(AuthContext);
  let location = useLocation();
  if (user === 'no-auth') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}