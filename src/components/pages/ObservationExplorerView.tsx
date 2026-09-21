import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronRight,
  Flame,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { SentinelObservation, DEMO_SITES } from '../../data/sentinelData';

interface ObservationExplorerViewProps {
  observations: SentinelObservation[];
  onSelectObservation: (obs: SentinelObservation) => void;
  initialFilter?: {
    site?: string;
    rule?: string;
    risk?: string;
  };
}

export const ObservationExplorerView: React.FC<ObservationExplorerViewProps> = ({
  observations,
  onSelectObservation,
  initialFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState(initialFilter?.site || 'All');
  const [riskFilter, setRiskFilter] = useState(initialFilter?.risk || 'All');
  const [sifFilter, setSifFilter] = useState('All');
  const [activityFilter, setActivityFilter] = useState('All');
  const [lsrFilter, setLsrFilter] = useState(initialFilter?.rule || 'All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredObservations = useMemo(() => {
    return observations.filter((obs) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = obs.report_id.toLowerCase().includes(query);
        const matchesText = obs.raw_narrative.toLowerCase().includes(query);
        const matchesSummary = (obs.ai_summary || '').toLowerCase().includes(query);
        const matchesSite = (obs.site || '').toLowerCase().includes(query);
        if (!matchesId && !matchesText && !matchesSummary && !matchesSite) return false;
      }

      // Site filter
      if (siteFilter !== 'All' && obs.site !== siteFilter) {
        return false;
      }

      // Risk filter
      if (riskFilter !== 'All') {
        if (riskFilter === 'Critical' && obs.severity !== 'CRITICAL') return false;
        if (riskFilter === 'High' && obs.severity !== 'HIGH') return false;
        if (riskFilter === 'Low' && (obs.severity === 'CRITICAL' || obs.severity === 'HIGH')) return false;
      }

      // SIF filter
      if (sifFilter !== 'All') {
        if (sifFilter === 'SIF Potential' && !obs.sif_potential) return false;
        if (sifFilter === 'Non-SIF' && obs.sif_potential) return false;
      }

      // Activity filter
      if (activityFilter !== 'All' && obs.activity !== activityFilter) {
        return false;
      }

      // LSR filter
      if (lsrFilter !== 'All' && obs.iogp_rule !== lsrFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'All') {
        const status = obs.review_status || obs.status || 'Under Review';
        if (status !== statusFilter) return false;
      }

      return true;
    });
  }, [observations, searchTerm, siteFilter, riskFilter, sifFilter, activityFilter, lsrFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSiteFilter('All');
    setRiskFilter('All');
    setSifFilter('All');
    setActivityFilter('All');
    setLsrFilter('All');
    setStatusFilter('All');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    siteFilter !== 'All' ||
    riskFilter !== 'All' ||
    sifFilter !== 'All' ||
    activityFilter !== 'All' ||
    lsrFilter !== 'All' ||
    statusFilter !== 'All';

  // Activities list
  const activities = [
    'All',
    'Maintenance',
    'Lifting',
    'Hot Work',
    'Working at Height',
    'Confined Space Entry',
    'Equipment Isolation',
    'Routine Operations',
    'Driving'
  ];

  // Life-Saving Rules
  const rules = [
    'All',
    'Energy Isolation',
    'Safe Mechanical Lifting',
    'Hot Work',
    'Working at Height',
    'Bypassing Safety Controls',
    'Confined Space',
    'Line of Fire',
    'Work Authorisation',
    'Driving'
  ];

  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by report text or observation ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Site Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              SITE
            </label>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All</option>
              {DEMO_SITES.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              RISK
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* SIF Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              SIF
            </label>
            <select
              value={sifFilter}
              onChange={(e) => setSifFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All</option>
              <option value="SIF Potential">SIF Potential</option>
              <option value="Non-SIF">Non-SIF</option>
            </select>
          </div>

          {/* Activity Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              ACTIVITY
            </label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {activities.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* LSR Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              LSR
            </label>
            <select
              value={lsrFilter}
              onChange={(e) => setLsrFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {rules.map((rule) => (
                <option key={rule} value={rule}>
                  {rule}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              STATUS
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All</option>
              <option value="Escalated">Escalated</option>
              <option value="Needs Investigation">Needs Investigation</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Showing Count and Clear Filter bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredObservations.length}</strong> of {observations.length} observations
        </span>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Table Card matching Screenshot 274 */}
      <div className="bg-white dark:bg-[#131f37] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">SITE</th>
                <th className="py-3 px-4">ACTIVITY</th>
                <th className="py-3 px-4">RISK</th>
                <th className="py-3 px-4">SIF</th>
                <th className="py-3 px-4">SCORE</th>
                <th className="py-3 px-4">LSR</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredObservations.map((obs) => {
                const dateFormatted = new Date(obs.timestamp).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                const isCritical = obs.severity === 'CRITICAL';
                const isHigh = obs.severity === 'HIGH';

                return (
                  <tr
                    key={obs.report_id}
                    onClick={() => onSelectObservation(obs)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {obs.report_id}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {dateFormatted}
                    </td>

                    {/* Site */}
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {obs.site}
                    </td>

                    {/* Activity */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {obs.activity}
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCritical
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {isCritical ? 'Critical' : isHigh ? 'High' : 'Low'}
                      </span>
                    </td>

                    {/* SIF Badge */}
                    <td className="py-3.5 px-4">
                      {obs.sif_potential ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/40">
                          SIF Potential
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* SIF Score */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold font-mono text-xs ${
                          obs.sif_score >= 90
                            ? 'text-red-600 dark:text-red-400 flex items-center gap-1'
                            : obs.sif_score >= 80
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {obs.sif_score}
                        {obs.sif_score >= 90 && <Flame className="w-3 h-3 text-red-500 inline" />}
                      </span>
                    </td>

                    {/* LSR */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {obs.iogp_rule}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          obs.review_status === 'Escalated' || obs.status === 'Escalated'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                            : obs.review_status === 'Needs Investigation' || obs.status === 'Needs Investigation'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            : obs.review_status === 'Confirmed' || obs.status === 'Confirmed'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {obs.review_status || obs.status || 'Under Review'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredObservations.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No safety observations match the selected criteria. Try adjusting your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
