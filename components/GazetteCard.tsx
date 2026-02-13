
import React from 'react';
import { GazetteIssue } from '../types';

interface GazetteCardProps {
  issue: GazetteIssue;
  onRead: (issue: GazetteIssue) => void;
}

const GazetteCard: React.FC<GazetteCardProps> = ({ issue, onRead }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={issue.imageUrl} 
          alt={issue.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {issue.isNew && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
            Nouveau
          </span>
        )}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-xs font-medium">N° {issue.number} • {issue.date}</p>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-serif font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-800 transition-colors">
          {issue.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
          {issue.summary}
        </p>
        <button 
          onClick={() => onRead(issue)}
          className="w-full py-2.5 bg-slate-50 group-hover:bg-blue-800 text-slate-600 group-hover:text-white rounded-xl text-sm font-bold transition-all duration-200"
        >
          Lire le numéro
        </button>
      </div>
    </div>
  );
};

export default GazetteCard;
