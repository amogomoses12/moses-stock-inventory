import React, { useEffect } from 'react';
import { X } from 'lucide-react';
export default function Modal({ title, onClose, children }) {
  useEffect(() => { const fn = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn); }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="modal"><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>{children}</section></div>;
}
