import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialCategories, initialProducts } from '../data/seed';

const StoreContext = createContext(null);
const read = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => read('moses-products', initialProducts));
  const [categories, setCategories] = useState(() => read('moses-categories', initialCategories));
  const [settings, setSettings] = useState(() => read('moses-settings', { currency: 'NGN', lowStock: 10, businessName: 'Moses Stock' }));
  const [user, setUser] = useState(() => read('moses-user', null));
  const [activities, setActivities] = useState(() => read('moses-activities', [
    { id: 1, text: 'Smart Watch Pro stock updated', time: 'Today, 10:42 AM', type: 'update' },
    { id: 2, text: 'New category Home & Living created', time: 'Yesterday, 4:15 PM', type: 'category' },
    { id: 3, text: 'Wireless Mouse is running low', time: 'Yesterday, 11:20 AM', type: 'warning' }
  ]));

  useEffect(() => localStorage.setItem('moses-products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('moses-categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('moses-settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('moses-user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('moses-activities', JSON.stringify(activities)), [activities]);

  const addActivity = (text, type = 'update') => setActivities(prev => [{ id: Date.now(), text, time: 'Just now', type }, ...prev].slice(0, 8));
  const login = (email, role = 'admin') => setUser({ email, role, name: email.split('@')[0] || 'Administrator' });
  const logout = () => setUser(null);
  const value = useMemo(() => ({ products, setProducts, categories, setCategories, settings, setSettings, user, login, logout, activities, addActivity }), [products, categories, settings, user, activities]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
