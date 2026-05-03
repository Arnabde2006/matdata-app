import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

const SAMPLE_TIMELINE = [
  { id: 1, title_en: 'Notification of Election', title_hi: 'चुनाव की अधिसूचना', date: '2024-03-16', desc_en: 'Official announcement by ECI', desc_hi: 'ईसीआई द्वारा आधिकारिक घोषणा' },
  { id: 2, title_en: 'Last Date for Nominations', title_hi: 'नामांकन की अंतिम तिथि', date: '2024-03-27', desc_en: 'Final day for candidates to submit papers', desc_hi: 'उम्मीदवारों के लिए कागजात जमा करने का अंतिम दिन' },
  { id: 3, title_en: 'Polling Date (Phase 1)', title_hi: 'मतदान तिथि (चरण 1)', date: '2024-04-19', desc_en: 'Cast your vote', desc_hi: 'अपना वोट डालें' },
  { id: 4, title_en: 'Counting of Votes', title_hi: 'वोटों की गिनती', date: '2024-06-04', desc_en: 'Results are declared', desc_hi: 'परिणाम घोषित किए जाते हैं' }
];

export const TimelinePage = () => {
  const { t, i18n } = useTranslation();
  const [selectedState, setSelectedState] = useState('');

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-accent mb-4 flex items-center justify-center gap-2">
          <Calendar className="w-8 h-8" />
          {t('nav_timeline')}
        </h2>
        <p className="text-muted-foreground mb-6">Track important dates and deadlines for upcoming elections.</p>
        
        <select 
          className="border border-input bg-background rounded-md px-4 py-2 text-sm max-w-xs mx-auto w-full focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select State / राज्य चुनें</option>
          <option value="UP">Uttar Pradesh / उत्तर प्रदेश</option>
          <option value="MH">Maharashtra / महाराष्ट्र</option>
        </select>
      </div>

      <div className="relative border-l-2 border-primary ml-4 md:ml-8 space-y-8">
        {SAMPLE_TIMELINE.map((event, index) => {
          const isPast = dayjs(event.date).isBefore(dayjs());
          return (
            <div key={event.id} className="relative pl-8 md:pl-10">
              {/* Timeline dot */}
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-background ${isPast ? 'bg-muted-foreground' : 'bg-primary'}`}></div>
              
              <div className={`bg-card border border-border p-5 rounded-lg shadow-sm ${isPast ? 'opacity-60' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-foreground">
                    {i18n.language === 'en' ? event.title_en : event.title_hi}
                  </h3>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${isPast ? 'bg-muted text-muted-foreground' : 'bg-secondary/10 text-secondary'}`}>
                    {dayjs(event.date).format('DD MMM YYYY')}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {i18n.language === 'en' ? event.desc_en : event.desc_hi}
                </p>
                
                {!isPast && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                    <AlertCircle className="w-4 h-4" /> 
                    {dayjs(event.date).diff(dayjs(), 'day')} days remaining
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-card border border-border p-6 rounded-xl shadow-sm">
        <h3 className="font-heading font-bold text-xl text-accent mb-4">Important Forms</h3>
        <p className="text-muted-foreground mb-4">Access voter registration and modification forms directly from the Election Commission of India website:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="https://voters.eci.gov.in/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <span className="font-bold text-primary">Form 6</span>
            <span className="text-sm">Register as a new voter</span>
          </a>
          <a href="https://voters.eci.gov.in/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <span className="font-bold text-primary">Form 6A</span>
            <span className="text-sm">Include name of overseas elector</span>
          </a>
          <a href="https://voters.eci.gov.in/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <span className="font-bold text-primary">Form 7</span>
            <span className="text-sm">Object to / delete name from roll</span>
          </a>
          <a href="https://voters.eci.gov.in/login" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <span className="font-bold text-primary">Form 8</span>
            <span className="text-sm">Shift residence / correction of entries</span>
          </a>
        </div>
      </div>
    </div>
  );
};
