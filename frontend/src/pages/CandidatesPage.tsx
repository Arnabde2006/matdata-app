import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Briefcase, GraduationCap, AlertTriangle } from 'lucide-react';

const SAMPLE_CANDIDATES = [
  { id: 1, name_en: 'Rahul Sharma', name_hi: 'राहुल शर्मा', party: 'BJP', age: 45, education: 'Post Graduate', assets: '₹ 5.2 Cr', criminal: 0, constituency: 'Varanasi', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', symbol_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/150px-Bharatiya_Janata_Party_logo.svg.png' },
  { id: 2, name_en: 'Priya Patel', name_hi: 'प्रिया पटेल', party: 'INC', age: 38, education: 'Graduate Professional', assets: '₹ 2.1 Cr', criminal: 1, constituency: 'Varanasi', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', symbol_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_hand_logo.svg/150px-Indian_National_Congress_hand_logo.svg.png' },
  { id: 3, name_en: 'Amit Singh', name_hi: 'अमित सिंह', party: 'AAP', age: 41, education: 'Doctorate', assets: '₹ 80 Lacs', criminal: 0, constituency: 'Varanasi', photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop', symbol_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Aam_Aadmi_Party_logo.svg/150px-Aam_Aadmi_Party_logo.svg.png' },
];

export const CandidatesPage = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = SAMPLE_CANDIDATES.filter(c => 
    c.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
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
        {filteredCandidates.map(candidate => (
          <div key={candidate.id} className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="h-2 bg-primary w-full"></div>
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-foreground mb-1">
                    {i18n.language === 'en' ? candidate.name_en : candidate.name_hi}
                  </h3>
                  <span className="inline-flex items-center gap-2 px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-md">
                    <img src={candidate.symbol_url} alt={candidate.party} className="w-4 h-4 object-contain" />
                    {candidate.party}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border">
                  <img src={candidate.photo_url} alt={candidate.name_en} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-3 text-sm mt-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>Constituency: <strong className="text-foreground">{candidate.constituency}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>Education: <strong className="text-foreground">{candidate.education}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="font-bold text-primary mr-1">₹</span>
                  <span>Assets: <strong className="text-foreground">{candidate.assets}</strong></span>
                </div>
                {candidate.criminal > 0 && (
                  <div className="flex items-center gap-3 text-destructive font-medium mt-2 p-2 bg-destructive/10 rounded-md">
                    <AlertTriangle className="w-4 h-4" />
                    {candidate.criminal} Criminal Cases
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/30">
              <button className="w-full text-center text-primary font-medium text-sm hover:underline">
                View Full Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
