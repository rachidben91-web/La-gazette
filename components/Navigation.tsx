
import React from 'react';
import { ViewState } from '../types';
import { Icons } from '../constants';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  hasUnread: boolean;
  isAdmin: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, hasUnread, isAdmin }) => {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Icons.Home },
    { id: 'archive', label: 'Archives', icon: Icons.Archive },
    { id: 'suggestions', label: 'Vos Idées', icon: Icons.Message },
  ];

  // On n'ajoute l'onglet Admin que si l'utilisateur a le rôle
  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Rédaction', icon: Icons.Admin });
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 md:relative md:w-64 md:h-screen md:border-t-0 md:border-r z-50 flex flex-col">
      <div className="hidden md:flex flex-col p-6 items-center">
        <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center mb-2 shadow-lg">
          <span className="text-white font-serif text-2xl">É</span>
        </div>
        <h1 className="text-xl font-serif font-bold text-slate-800 text-center">L'Écho</h1>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Gazette Interne</p>
      </div>

      <div className="flex md:flex-col justify-around md:justify-start md:px-4 md:space-y-2 py-2 md:py-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`flex flex-col md:flex-row items-center p-3 rounded-xl transition-all duration-200 group relative
              ${currentView === item.id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-500 hover:text-blue-500 hover:bg-slate-50'
              }`}
          >
            <item.icon />
            <span className="text-[10px] md:text-sm font-semibold md:ml-3 mt-1 md:mt-0">{item.label}</span>
            {item.id === 'home' && hasUnread && (
              <span className="absolute top-2 right-2 md:static md:ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
      
      <div className="hidden md:block mt-auto p-6 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-bold uppercase text-center">Agence V1.0</p>
      </div>
    </nav>
  );
};

export default Navigation;
