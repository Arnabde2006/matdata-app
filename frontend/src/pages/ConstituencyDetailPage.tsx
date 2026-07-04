import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, CheckSquare, Award, Percent, TrendingUp } from 'lucide-react';
import { SourceAttribution } from '../components/shared/SourceAttribution';
import { ConstituencyDetail } from '../types/electoral';

export function ConstituencyDetailPage() {
  const { electionId, constituencyId } = useParams<{ electionId: string; constituencyId: string }>();
  const [detail, setDetail] = useState<ConstituencyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/elections/${electionId}/constituencies/${constituencyId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load constituency details');
        return res.json();
      })
      .then((data) => {
        setDetail(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching constituency details:', err);
        setError('Could not load details for this constituency.');
        setIsLoading(false);
      });
  }, [electionId, constituencyId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded w-1/2"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center text-red-500">
        <p className="text-xl font-semibold mb-2">{error || 'Constituency details not found.'}</p>
        <Link to={`/elections/${electionId}/constituencies`} className="text-primary hover:underline font-semibold">
          Return to constituencies list
        </Link>
      </div>
    );
  }

  const winner = detail.candidates.find((c) => c.is_winner);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link
        to={`/elections/${electionId}/constituencies`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Constituencies / वापस जाएं
      </Link>

      {/* Title Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase rounded-full">
            {detail.seat_type} Seat
          </span>
          <span className="text-sm font-medium text-muted-foreground">{detail.state}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {detail.name} Constituency Results
        </h1>
        {winner && (
          <p className="text-muted-foreground text-sm mt-2 flex items-center gap-1">
            <Award className="h-4 w-4 text-emerald-500 shrink-0" />
            Winner: <span className="font-bold text-foreground">{winner.name} ({winner.party})</span>
          </p>
        )}
      </div>

      {/* Turnout & Electors Summary Panel */}
      {detail.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Voter Turnout %
            </span>
            <div className="flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-indigo-500 shrink-0" />
              <span className="text-xl font-extrabold text-foreground">
                {detail.summary.turnout_pct}%
              </span>
            </div>
          </div>

          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Total Electors
            </span>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-xl font-extrabold text-foreground">
                {detail.summary.total_electors.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Votes Cast
            </span>
            <div className="flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-xl font-extrabold text-foreground">
                {detail.summary.total_votes_polled.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Valid Votes
            </span>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-teal-500 shrink-0" />
              <span className="text-xl font-extrabold text-foreground">
                {detail.summary.valid_votes.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Breakdown & Chart */}
      <div className="space-y-8">
        {/* Horizontal Bar Chart of Vote Share */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-6 pb-3 border-b border-border/60">
            Vote Share Comparison / मत प्रतिशत
          </h2>

          <div className="space-y-5">
            {detail.candidates.map((c) => {
              const maxVoteShare = Math.max(...detail.candidates.map((cand) => cand.vote_share_pct), 1);
              const barWidth = (c.vote_share_pct / maxVoteShare) * 100;

              return (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex justify-between items-start sm:items-center text-sm font-medium gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className={`font-bold ${c.is_winner ? 'text-primary' : 'text-foreground'}`}>
                        {c.name}
                      </span>
                      <span className="text-xs bg-muted font-semibold text-muted-foreground px-2 py-0.5 rounded-md w-fit">
                        {c.party}
                      </span>
                      {c.is_winner && (
                        <span className="text-[10px] uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-extrabold px-1.5 py-0.25 rounded shrink-0">
                          Won
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-foreground">{c.vote_share_pct}%</span>
                      <span className="text-xs text-muted-foreground block sm:inline sm:ml-2">
                        ({c.votes.toLocaleString('en-IN')} votes)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${c.is_winner ? 'bg-primary' : 'bg-primary/60'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accessible Data Table */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Candidate Breakdown Table (Accessible)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Party</th>
                  <th className="px-4 py-3 text-right">Votes</th>
                  <th className="px-4 py-3 text-right">Vote Share</th>
                  <th className="px-4 py-3 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {detail.candidates.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-muted/20 ${c.is_winner ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">{c.name}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{c.party}</td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">
                      {c.votes.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground font-bold">{c.vote_share_pct}%</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          c.is_winner
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {c.is_winner ? 'Winner' : 'Runner-up'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Source Citation */}
        <SourceAttribution
          source={detail.source}
          sourceUrl={detail.source_url}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
