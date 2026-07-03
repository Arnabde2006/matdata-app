import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users, AlertTriangle } from 'lucide-react';

const getSymbolUrl = (symbolName: string) => {
  const urls: Record<string, string> = {
    'Lotus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/150px-Bharatiya_Janata_Party_logo.svg.png',
    'Hand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_hand_logo.svg/150px-Indian_National_Congress_hand_logo.svg.png',
    'Broom': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Aam_Aadmi_Party_logo.svg/150px-Aam_Aadmi_Party_logo.svg.png'
  };
  return urls[symbolName] || '';
};

export const CandidateComparePage = () => {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const ids = searchParams.get('ids') || '';

  useEffect(() => {
    if (!ids) {
      setError('No candidates selected for comparison.');
      setIsLoading(false);
      return;
    }

    fetch(`/api/candidates/compare?ids=${ids}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load comparison data.');
        return res.json();
      })
      .then((data) => {
        setCandidates(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error loading comparison details. Please select 2-3 valid candidates.');
        setIsLoading(false);
      });
  }, [ids]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 text-center text-muted-foreground">
        Loading comparison...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-8 text-center space-y-4">
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
          {error}
        </div>
        <button
          onClick={() => navigate('/candidates')}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-primary hover:text-primary rounded-lg transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidates
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/candidates')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidates
        </button>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-accent mb-4 flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Candidate Comparison
        </h2>
        <p className="text-muted-foreground">Side-by-side comparison of candidate profiles, education, assets, and details.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-4 font-bold text-sm text-muted-foreground w-1/4">Criteria</th>
              {candidates.map((candidate) => (
                <th key={candidate.id} className="p-4 font-bold text-base text-foreground w-1/4 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={candidate.photo_url}
                      alt={candidate.name_en}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <div className="font-bold text-lg">
                        {i18n.language === 'en' ? candidate.name_en : candidate.name_hi}
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs font-semibold rounded-md mt-1">
                        <img
                          src={getSymbolUrl(candidate.party.symbol)}
                          alt={candidate.party.symbol}
                          className="w-4 h-4 object-contain"
                        />
                        {i18n.language === 'en' ? candidate.party.name_en : candidate.party.name_hi}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-muted/10">
              <td className="p-4 font-semibold text-sm text-muted-foreground">Age</td>
              {candidates.map((c) => (
                <td key={c.id} className="p-4 text-center text-sm font-medium text-foreground">{c.age} Years</td>
              ))}
            </tr>
            <tr className="border-b border-border hover:bg-muted/10">
              <td className="p-4 font-semibold text-sm text-muted-foreground">Constituency</td>
              {candidates.map((c) => (
                <td key={c.id} className="p-4 text-center text-sm font-medium text-foreground">
                  {i18n.language === 'en' ? c.constituency.name_en : c.constituency.name_hi} ({c.constituency.type})
                </td>
              ))}
            </tr>
            <tr className="border-b border-border hover:bg-muted/10">
              <td className="p-4 font-semibold text-sm text-muted-foreground">Education</td>
              {candidates.map((c) => (
                <td key={c.id} className="p-4 text-center text-sm font-medium text-foreground">{c.education}</td>
              ))}
            </tr>
            <tr className="border-b border-border hover:bg-muted/10">
              <td className="p-4 font-semibold text-sm text-muted-foreground">Assets</td>
              {candidates.map((c) => (
                <td key={c.id} className="p-4 text-center text-sm font-medium text-foreground">{c.assets}</td>
              ))}
            </tr>
            <tr className="hover:bg-muted/10">
              <td className="p-4 font-semibold text-sm text-muted-foreground">Criminal Cases</td>
              {candidates.map((c) => (
                <td key={c.id} className="p-4 text-center text-sm">
                  {c.criminal_cases > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-destructive/10 text-destructive font-medium rounded-full text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" /> {c.criminal_cases} Cases
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium rounded-full text-xs">
                      No Cases
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
