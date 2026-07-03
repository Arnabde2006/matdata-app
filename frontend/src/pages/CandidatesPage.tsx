import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users, Search, Briefcase, GraduationCap, AlertTriangle, CheckSquare, Square } from 'lucide-react';

const getSymbolUrl = (symbolName: string) => {
  const urls: Record<string, string> = {
    'Lotus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/150px-Bharatiya_Janata_Party_logo.svg.png',
    'Hand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_hand_logo.svg/150px-Indian_National_Congress_hand_logo.svg.png',
    'Broom': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Aam_Aadmi_Party_logo.svg/150px-Aam_Aadmi_Party_logo.svg.png'
  };
  return urls[symbolName] || '';
};

export const CandidatesPage = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/candidates')
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading candidates:', err);
        setIsLoading(false);
      });
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const name = i18n.language === 'en' ? c.name_en : c.name_hi;
    const party = i18n.language === 'en' ? c.party.name_en : c.party.name_hi;
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || party.toLowerCase().includes(term);
  });

  const handleSelect = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center text-muted-foreground">
        Loading candidates...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 relative">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-accent mb-4 flex items-center justify-center gap-2">
          <Users className="w-8 h-8" />
          {t('nav_candidates')}
        </h2>
        <p className="text-muted-foreground mb-6">Know your candidates. Make an informed choice.</p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input 
            type="text" 
            placeholder={t('search_candidate')}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => {
          const isSelected = selectedIds.includes(candidate.id);
          const partyName = i18n.language === 'en' ? candidate.party.name_en : candidate.party.name_hi;
          const constituencyName = i18n.language === 'en' ? candidate.constituency.name_en : candidate.constituency.name_hi;

          return (
            <div key={candidate.id} className={`bg-card border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
              <div className="h-2 bg-primary w-full"></div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-foreground mb-1">
                      {i18n.language === 'en' ? candidate.name_en : candidate.name_hi}
                    </h3>
                    <span className="inline-flex items-center gap-2 px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-md max-w-[150px] truncate">
                      <img src={getSymbolUrl(candidate.party.symbol)} alt={candidate.party.symbol} className="w-4 h-4 object-contain shrink-0" />
                      <span className="truncate">{partyName}</span>
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border shrink-0">
                    <img src={candidate.photo_url} alt={candidate.name_en} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-3 text-sm mt-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>Constituency: <strong className="text-foreground">{constituencyName}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>Education: <strong className="text-foreground">{candidate.education}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="font-bold text-primary mr-1">₹</span>
                    <span>Assets: <strong className="text-foreground">{candidate.assets}</strong></span>
                  </div>
                  {candidate.criminal_cases > 0 && (
                    <div className="flex items-center gap-3 text-destructive font-medium mt-2 p-2 bg-destructive/10 rounded-md">
                      <AlertTriangle className="w-4 h-4" />
                      {candidate.criminal_cases} Criminal Cases
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                <button
                  onClick={() => handleSelect(candidate.id)}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  {isSelected ? 'Selected' : 'Compare Candidate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedIds.length >= 2 && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce">
          <Link
            to={`/candidates/compare?ids=${selectedIds.join(',')}`}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-primary/90 transition-all text-sm uppercase tracking-wider"
          >
            Compare Candidates ({selectedIds.length}/3)
          </Link>
        </div>
      )}
    </div>
  );
};
