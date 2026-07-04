import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, User, HelpCircle, ArrowLeft } from 'lucide-react';
import { SourceAttribution } from '../components/shared/SourceAttribution';
import { ConstituencyListItem, HistoricalElection } from '../types/electoral';

export function ConstituencyListPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const [constituencies, setConstituencies] = useState<ConstituencyListItem[]>([]);
  const [election, setElection] = useState<HistoricalElection | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 15;
  const offset = (page - 1) * limit;

  // Load election metadata for headers
  useEffect(() => {
    fetch(`/api/elections/${electionId}/summary`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load election details');
        return res.json();
      })
      .then((data) => {
        setElection(data.election);
      })
      .catch((err) => {
        console.error('Error fetching election info:', err);
        setError('Could not load election details.');
      });
  }, [electionId]);

  // Load paginated/filtered constituency list
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/elections/${electionId}/constituencies?search=${encodeURIComponent(search)}&offset=${offset}&limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load constituencies');
        return res.json();
      })
      .then((data) => {
        setConstituencies(data.constituencies);
        setTotalCount(data.total);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching constituencies:', err);
        setError('Could not load constituencies list.');
        setIsLoading(false);
      });
  }, [electionId, search, offset]);

  // Reset page when search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link
        to="/elections"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Summary / वापस जाएं
      </Link>

      {/* Header */}
      {election && (
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            {election.type} {election.year} - Constituency Results
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse seats, candidates, and victory margins for this election.
          </p>
        </div>
      )}

      {/* Search and Pagination Summary */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search constituency name... / खोजें..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
          />
        </div>

        <div className="text-sm font-medium text-muted-foreground">
          Showing {constituencies.length} of {totalCount} constituencies
        </div>
      </div>

      {isLoading ? (
        // Skeleton Screens
        <div className="space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 border border-border rounded-xl bg-card">
          <p className="font-semibold">{error}</p>
        </div>
      ) : constituencies.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-xl">
          <HelpCircle className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No constituencies match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List Cards */}
          <div className="grid grid-cols-1 gap-3">
            {constituencies.map((c) => (
              <Link
                key={c.id}
                to={`/elections/${electionId}/constituencies/${c.id}`}
                className="bg-card hover:bg-muted/10 border border-border rounded-xl p-4 shadow-sm hover:shadow transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {c.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground font-medium rounded-full uppercase">
                      {c.seat_type}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    State: <span className="text-foreground">{c.state}</span>
                  </div>
                </div>

                {c.winner ? (
                  <div className="flex flex-col sm:items-end">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                      <User className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{c.winner.name}</span>
                      <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold shrink-0">
                        {c.winner.party}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                      Margin: <span className="font-semibold text-foreground">{c.margin.toLocaleString('en-IN')} votes</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-muted-foreground">Winner information pending</div>
                )}
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 border border-border rounded-lg bg-card text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-semibold text-muted-foreground px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 border border-border rounded-lg bg-card text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Source Attribution */}
          {election && (
            <SourceAttribution
              source={election.source}
              sourceUrl={election.source_url}
              className="mx-auto mt-6"
            />
          )}
        </div>
      )}
    </div>
  );
}
