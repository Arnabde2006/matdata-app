import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { SpeakButton } from '../components/shared/SpeakButton';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const TimelinePage = () => {
  const { t, i18n } = useTranslation();
  useDocumentMeta(t('meta_timeline_title'), t('meta_timeline_desc'));
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState<any[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error('Error fetching states:', err));
  }, []);

  useEffect(() => {
    const url = selectedState ? `/api/timeline?stateId=${selectedState}` : '/api/timeline';
    fetch(url)
      .then((res) => res.json())
      .then((data) => setTimelineEvents(data))
      .catch((err) => console.error('Error fetching timeline:', err));
  }, [selectedState]);

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
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {i18n.language === 'en' ? state.name_en : state.name_hi}
            </option>
          ))}
        </select>
      </div>

      <div className="relative border-l-2 border-primary ml-4 md:ml-8 space-y-8">
        {timelineEvents.map((event) => {
          const isPast = dayjs(event.event_date).isBefore(dayjs());
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
                    {dayjs(event.event_date).format('DD MMM YYYY')}
                  </span>
                </div>
                <div className="flex gap-2 items-start justify-between">
                  <p className="text-muted-foreground flex-1">
                    {i18n.language === 'en' ? event.description_en : event.description_hi}
                  </p>
                  <SpeakButton text={i18n.language === 'en' ? event.description_en : event.description_hi} lang={i18n.language === 'hi' ? 'hi' : 'en'} />
                </div>
                
                {!isPast && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                    <AlertCircle className="w-4 h-4" /> 
                    {dayjs(event.event_date).diff(dayjs(), 'day')} days remaining
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
