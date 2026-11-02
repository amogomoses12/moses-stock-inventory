import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Settings from './pages/Settings';

function Protected({ children }) {
  const { user } = useStore();
  return user ? children : <Navigate to="/login" replace />;
}
function AppRoutes() {
  const { user } = useStore();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/dashboard" replace/> : <Login/>}/>
    <Route path="/admin-login" element={user ? <Navigate to="/dashboard" replace/> : <Login admin/>}/>
    <Route element={<Protected><Layout/></Protected>}>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/products" element={<Products/>}/>
      <Route path="/categories" element={<Categories/>}/>
      <Route path="/settings" element={<Settings/>}/>
    </Route>
    <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace/>}/>
  </Routes>;
}
export default function App() { return <StoreProvider><AppRoutes/></StoreProvider>; }
