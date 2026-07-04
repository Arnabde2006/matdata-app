import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, Percent, ChevronRight, BarChart2 } from 'lucide-react';
import { SourceAttribution } from '../components/shared/SourceAttribution';
import { HistoricalElection, ElectionSummary } from '../types/electoral';

export function ElectionViewerPage() {
  const [elections, setElections] = useState<HistoricalElection[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [summary, setSummary] = useState<ElectionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load elections list
  useEffect(() => {
    fetch('/api/elections')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load elections');
        return res.json();
      })
      .then((data) => {
        setElections(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching elections:', err);
        setError('Could not load elections. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  // Load selected election summary
  useEffect(() => {
    if (selectedId === null) return;

    setIsLoadingSummary(true);
    fetch(`/api/elections/${selectedId}/summary`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load election summary');
        return res.json();
      })
      .then((data) => {
        setSummary(data);
        setIsLoadingSummary(false);
      })
      .catch((err) => {
        console.error('Error fetching summary:', err);
        setIsLoadingSummary(false);
      });
  }, [selectedId]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 text-center">
        <div className="animate-pulse flex flex-col items-center space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center text-red-500">
        <p className="text-xl font-semibold mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3 flex items-center justify-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          Previous Election Reports / पिछला चुनाव रिपोर्ट
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
          Explore historical seats tallies, voter turnout percentages, and constituency-level breakdowns from verified government and ECI reports.
        </p>
      </div>

      {/* Picker UI */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <label htmlFor="election-picker" className="block text-sm font-semibold text-muted-foreground mb-1.5">
            Select Election / चुनाव का चयन करें
          </label>
          <select
            id="election-picker"
            value={selectedId || ''}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-full sm:w-80 px-4 py-2.5 bg-background border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
          >
            {elections.map((e) => (
              <option key={e.id} value={e.id}>
                {e.type} {e.year} {e.state ? `(${e.state})` : ''}
              </option>
            ))}
          </select>
        </div>

        {summary && (
          <Link
            to={`/elections/${selectedId}/constituencies`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition-all shadow hover:shadow-md"
          >
            Browse Constituencies / निर्वाचन क्षेत्र देखें
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {isLoadingSummary ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-28 bg-muted rounded-xl"></div>
            <div className="h-28 bg-muted rounded-xl"></div>
            <div className="h-28 bg-muted rounded-xl"></div>
          </div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      ) : summary ? (
        <div className="space-y-8">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Turnout Card */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">
                <Percent className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Voter Turnout / मतदान प्रतिशत
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {summary.overallTurnout}%
                </span>
              </div>
            </div>

            {/* Total Electors Card */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Electors / कुल मतदाता
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {summary.totalElectors.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Total Votes Polled Card */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
                <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Votes Cast / डाले गए वोट
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {summary.totalVotesPolled.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Party Tallies Visualization */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border/60 pb-3">
              <BarChart2 className="h-5 w-5 text-primary" />
              Party Seats Tally / पार्टी सीट संख्या
            </h3>

            {summary.partyTallies.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">No constituency seat information available yet.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Horizontal Bar Chart (Visual Representation) */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Visual Breakdown</h4>
                  {summary.partyTallies.map((tally) => {
                    const maxSeats = summary.partyTallies[0]?.seats || 1;
                    const pct = (tally.seats / maxSeats) * 100;
                    return (
                      <div key={tally.party} className="space-y-1.5">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-foreground">{tally.party}</span>
                          <span className="text-muted-foreground font-semibold">{tally.seats} Seats</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Accessible Data Table Fallback */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-4">Seat Tally Table (Accessible)</h4>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <th className="px-4 py-3">Party Name</th>
                          <th className="px-4 py-3 text-right">Seats Won</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-sm">
                        {summary.partyTallies.map((tally) => (
                          <tr key={tally.party} className="hover:bg-muted/20">
                            <td className="px-4 py-3 font-medium text-foreground">{tally.party}</td>
                            <td className="px-4 py-3 text-right font-bold text-foreground">{tally.seats}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Source Citation */}
          <SourceAttribution
            source={summary.election.source}
            sourceUrl={summary.election.source_url}
            className="mx-auto"
          />
        </div>
      ) : (
        <div className="text-center py-12 bg-card border rounded-xl">
          <p className="text-muted-foreground font-medium">Data not yet available for the selected election.</p>
        </div>
      )}
    </div>
  );
}
