import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="hidden sm:flex h-12 border-t border-white/5 px-8 items-center justify-between text-[10px] text-gray-500 bg-brand-gray z-50">
      <div className="flex gap-6 uppercase tracking-widest font-medium">
        <span>G35 Ita Ajia Gambari Road, Ilorin, Kwara State, Nigeria</span>
        <span className="hidden md:inline">Phone: 09130664287, 08051156682</span>
      </div>
      <div className="flex gap-4">
        <span className="text-gray-300 font-mono">RTDB CONNECTED: 2.1ms</span>
        <span className="text-brand-orange font-mono uppercase font-bold">Golden Mother v1.0</span>
      </div>
    </footer>
  );
};
