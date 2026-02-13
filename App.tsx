
import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import GazetteCard from './components/GazetteCard';
import SuggestionBox from './components/SuggestionBox';
import AdminPanel from './components/AdminPanel';
import { GazetteIssue, ArticleSuggestion, ViewState } from './types';
import { Icons } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [isAdmin, setIsAdmin] = useState(false); // État de simulation Admin
  const [issues, setIssues] = useState<GazetteIssue[]>([]);
  const [suggestions, setSuggestions] = useState<ArticleSuggestion[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<GazetteIssue | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Chargement des données initiales
  useEffect(() => {
    const savedIssues = localStorage.getItem('agency_gazettes');
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    } else {
      const mockIssues: GazetteIssue[] = [
        {
          id: '1',
          title: "L'IA Générative : Notre nouveau collègue ?",
          number: 45,
          date: "20 Fév 2025",
          summary: "Analyse de l'intégration des outils Gemini dans nos processus créatifs et techniques.",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
          content: "L'intelligence artificielle transforme nos métiers. Dans ce numéro, nous rencontrons l'équipe tech qui a mis en place les nouveaux workflows...",
          isNew: true
        },
        {
          id: '2',
          title: "Succès Client : Le projet Helios est lancé",
          number: 44,
          date: "05 Fév 2025",
          summary: "Retour sur 6 mois de travail acharné pour livrer la plateforme Helios à notre plus gros client.",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
          content: "Après des semaines de tests intensifs, Helios est enfin en ligne. Les premiers retours sont excellents...",
          isNew: false
        }
      ];
      setIssues(mockIssues);
      localStorage.setItem('agency_gazettes', JSON.stringify(mockIssues));
    }
  }, []);

  const handlePublish = useCallback((newIssue: GazetteIssue) => {
    setIssues(prev => {
      const updated = [newIssue, ...prev];
      localStorage.setItem('agency_gazettes', JSON.stringify(updated));
      return updated;
    });
    
    // Simulation du Push Notification
    setLastNotification(`🔔 Nouveau numéro disponible : "${newIssue.title}"`);
    setShowNotification(true);
    
    // Jouer un petit son si possible ou vibration (simulation logicielle)
    if ('vibrate' in navigator) navigator.vibrate(200);

    setTimeout(() => setShowNotification(false), 8000);
  }, []);

  const handleAddSuggestion = (s: ArticleSuggestion) => {
    setSuggestions(prev => [s, ...prev]);
  };

  const handleRead = (issue: GazetteIssue) => {
    setSelectedIssue(issue);
    setView('reader');
    // Marquer comme lu
    setIssues(prev => {
      const updated = prev.map(i => i.id === issue.id ? { ...i, isNew: false } : i);
      localStorage.setItem('agency_gazettes', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
    if (view === 'admin') setView('home');
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="space-y-10 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Le Kiosque</h2>
                <p className="text-slate-500 mt-2 font-medium">L'actualité fraîche de votre agence, chaque semaine.</p>
              </div>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={toggleAdmin}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isAdmin ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                >
                  {isAdmin ? 'Mode Administrateur Actif' : 'Connexion Rédaction'}
                </button>
              </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {issues.map(issue => (
                <GazetteCard key={issue.id} issue={issue} onRead={handleRead} />
              ))}
            </div>
          </div>
        );

      case 'archive':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Archives de la Gazette</h2>
            <div className="grid grid-cols-1 gap-4">
              {issues.map(issue => (
                <div key={issue.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group" onClick={() => handleRead(issue)}>
                  <div className="flex items-center gap-6">
                    <img src={issue.imageUrl} className="w-20 h-20 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{issue.title}</h4>
                      <p className="text-sm text-slate-400">Numéro {issue.number} • Publié le {issue.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-blue-600">Lire l'archive</span>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
                       <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                       </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'suggestions':
        return <SuggestionBox onAdd={handleAddSuggestion} />;

      case 'admin':
        return isAdmin ? <AdminPanel onPublish={handlePublish} suggestions={suggestions} /> : <div className="text-center py-20">Accès restreint.</div>;

      case 'reader':
        return selectedIssue ? (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="relative h-[450px]">
              <img src={selectedIssue.imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-12">
                <span className="text-blue-400 font-bold text-sm mb-3 uppercase tracking-[0.2em]">Édition Officielle N° {selectedIssue.number}</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight max-w-2xl">{selectedIssue.title}</h2>
              </div>
            </div>
            <div className="p-8 md:p-16 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">R</div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">La Rédaction</p>
                    <p className="text-sm text-slate-400">Publié le {selectedIssue.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setView('home')} 
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour au kiosque
                </button>
              </div>
              <div className="prose prose-blue max-w-none">
                <p className="text-2xl font-serif italic text-slate-500 mb-10 leading-relaxed border-l-4 border-blue-600 pl-8 py-2">
                  {selectedIssue.summary}
                </p>
                <div className="text-xl text-slate-700 leading-relaxed space-y-6">
                  <p>{selectedIssue.content}</p>
                  <p>L'excellence opérationnelle reste notre priorité pour ce trimestre. En collaborant étroitement entre les départements, nous avons réussi à réduire nos délais de production de 15% tout en augmentant la satisfaction client.</p>
                  <div className="bg-slate-50 p-8 rounded-3xl my-10 border border-slate-100">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Le chiffre du mois</h3>
                    <p className="text-5xl font-bold text-blue-600 mb-2">98%</p>
                    <p className="text-slate-500 font-medium">De taux d'engagement sur nos derniers projets internes.</p>
                  </div>
                  <p>Nous tenons à remercier particulièrement l'équipe design pour le rafraîchissement de notre identité visuelle interne que vous pouvez apercevoir à travers cette nouvelle interface de gazette.</p>
                </div>
              </div>
              <div className="mt-16 pt-16 border-t border-slate-100 text-center">
                <h4 className="font-bold text-slate-900 text-xl mb-6">Réagir à ce numéro</h4>
                <div className="flex justify-center gap-6">
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-blue-50 group-hover:scale-110 transition-all shadow-sm">👍</div>
                    <span className="text-xs font-bold text-slate-400">Inspirant</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-red-50 group-hover:scale-110 transition-all shadow-sm">❤️</div>
                    <span className="text-xs font-bold text-slate-400">J'adore</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-amber-50 group-hover:scale-110 transition-all shadow-sm">🚀</div>
                    <span className="text-xs font-bold text-slate-400">On y va</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen md:flex bg-slate-50">
      <Navigation 
        currentView={view} 
        setView={setView} 
        hasUnread={issues.some(i => i.isNew)} 
        isAdmin={isAdmin}
      />
      
      <main className="flex-1 p-6 md:p-12 pb-32 md:pb-12 max-w-7xl mx-auto overflow-y-auto relative">
        {/* Banner de notification améliorée */}
        {showNotification && (
          <div className="fixed top-8 right-8 left-8 md:left-auto md:w-[400px] bg-white border border-blue-100 p-6 rounded-3xl shadow-2xl z-[100] animate-notification flex items-start gap-4 ring-4 ring-blue-50">
            <div className="bg-blue-800 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Icons.Bell />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Nouvelle Publication</p>
                <button onClick={() => setShowNotification(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="font-bold text-slate-900 leading-tight mb-3">{lastNotification}</p>
              <button 
                onClick={() => { setShowNotification(false); handleRead(issues[0]); }}
                className="text-xs font-black text-blue-800 hover:underline"
              >
                LIRE LE NUMÉRO MAINTENANT →
              </button>
            </div>
          </div>
        )}

        {renderContent()}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes notification {
          0% { transform: translateX(100%) scale(0.9); opacity: 0; }
          10% { transform: translateX(0) scale(1.05); opacity: 1; }
          15% { transform: translateX(0) scale(1); }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-notification { animation: notification 8s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default App;
