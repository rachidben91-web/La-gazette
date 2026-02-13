
import React, { useState } from 'react';
import { ArticleSuggestion } from '../types';
import { geminiService } from '../services/geminiService';

interface SuggestionBoxProps {
  onAdd: (suggestion: ArticleSuggestion) => void;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ onAdd }) => {
  const [topic, setTopic] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !desc) return;

    setLoading(true);
    // Corrected the method name call from refArticleSuggestion to refineArticleSuggestion
    const aiFeedback = await geminiService.refineArticleSuggestion(topic, desc);
    
    const newSuggestion: ArticleSuggestion = {
      id: Date.now().toString(),
      user: 'Collaborateur Anonyme',
      topic,
      description: desc,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('fr-FR'),
      aiFeedback
    };

    onAdd(newSuggestion);
    setFeedback(aiFeedback || "Proposition envoyée !");
    setTopic('');
    setDesc('');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Une idée d'article ?</h2>
        <p className="text-slate-500 mb-6 text-sm">Partagez vos idées avec l'équipe rédactionnelle. Notre assistant IA vous aidera à affiner votre proposition en direct.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sujet de l'article</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Le télétravail à l'agence..."
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description rapide</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder="Dites-nous en plus sur ce que vous aimeriez lire..."
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg
              ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900 shadow-blue-200'}`}
          >
            {loading ? 'Analyse par l\'IA...' : 'Soumettre mon idée'}
          </button>
        </form>
      </div>

      {feedback && (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">AI</div>
            <h3 className="font-bold text-blue-900">Conseils de la Rédaction (IA)</h3>
          </div>
          <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
            {feedback}
          </div>
          <button 
            onClick={() => setFeedback(null)}
            className="mt-4 text-xs font-bold text-blue-600 hover:underline"
          >
            Fermer le conseil
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestionBox;
