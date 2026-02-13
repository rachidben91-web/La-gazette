
import React, { useState } from 'react';
import { GazetteIssue, ArticleSuggestion } from '../types';

interface AdminPanelProps {
  onPublish: (issue: GazetteIssue) => void;
  suggestions: ArticleSuggestion[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onPublish, suggestions }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newIssue: GazetteIssue = {
      id: Date.now().toString(),
      title,
      number: Math.floor(Math.random() * 100),
      date: new Date().toLocaleDateString('fr-FR'),
      summary: content.substring(0, 150) + "...",
      imageUrl: imgUrl || `https://picsum.photos/seed/${Date.now()}/800/400`,
      content,
      isNew: true
    };

    onPublish(newIssue);
    setTitle('');
    setContent('');
    setImgUrl('');
    alert("Nouveau numéro publié ! Les collaborateurs vont recevoir une notification.");
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">Publier une Gazette</h2>
        <form onSubmit={handlePublish} className="space-y-4">
          <input 
            type="text" 
            placeholder="Titre du numéro"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input 
            type="text" 
            placeholder="URL de l'image de couverture (optionnel)"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea 
            placeholder="Contenu complet..."
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
          <button type="submit" className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-slate-200">
            Lancer la publication
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Boîte à idées ({suggestions.length})</h2>
        {suggestions.length === 0 ? (
          <div className="bg-slate-100 p-12 rounded-3xl flex flex-col items-center justify-center text-center">
            <p className="text-slate-400 font-medium">Aucune suggestion pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {suggestions.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{s.topic}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{s.createdAt}</span>
                </div>
                <p className="text-sm text-slate-500 mb-3">{s.description}</p>
                <div className="flex gap-2">
                  <button className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Accepter</button>
                  <button className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Refuser</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
