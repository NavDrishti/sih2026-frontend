import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  Flame, 
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { SafetyReport, RefineryUnit, SeverityLevel, IOGPRule } from '../../types/safety';
import { IndustrialBadge } from '../common/IndustrialBadge';

interface ReportsArchiveViewProps {
  reports: SafetyReport[];
  onSelectReport: (report: SafetyReport) => void;
}

export const ReportsArchiveView: React.FC<ReportsArchiveViewProps> = ({
  reports,
  onSelectReport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<RefineryUnit | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | 'ALL'>('ALL');
  const [sifOnly, setSifOnly] = useState(false);

  const units: (RefineryUnit | 'ALL')[] = [
    'ALL', 'DHT', 'FCC', 'SRU', 'CDU', 'Tank Farm', 'Hydrocracker', 'VDU', 'NHT'
  ];

  const filteredReports = reports.filter((r) => {
    if (selectedUnit !== 'ALL' && r.unit !== selectedUnit) return false;
    if (selectedSeverity !== 'ALL' && r.severity !== selectedSeverity) return false;
    if (sifOnly && !r.sif_potential) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        r.report_id.toLowerCase().includes(q) ||
        r.unit.toLowerCase().includes(q) ||
        r.equipment.toLowerCase().includes(q) ||
        r.raw_narrative.toLowerCase().includes(q) ||
        r.ai_summary.toLowerCase().includes(q) ||
        r.iogp_rule.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredReports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `refinery_sif_reports_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 font-mono text-xs pb-12">
      {/* Header Bar */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-hazard-cyan" />
            <h2 className="text-base font-bold text-white tracking-widest uppercase">
              REFINERY INCIDENT & SIF PRECURSOR INVESTIGATION ARCHIVE
            </h2>
          </div>
          <p className="text-xs text-industrial-400 font-sans mt-0.5">
            Central audit repository for safety observations, barrier analyses, and causal determinations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-industrial-800 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 text-xs font-mono transition"
          >
            <Download className="w-3.5 h-3.5 text-hazard-cyan" />
            <span>EXPORT ARCHIVE (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-3 bg-industrial-900/60 border border-industrial-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-industrial-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports archive..."
              className="w-full bg-industrial-950 border border-industrial-800 pl-8 pr-3 py-1 text-xs text-white placeholder-industrial-500 focus:outline-hidden"
            />
          </div>

          {/* Unit Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-industrial-500 uppercase">UNIT:</span>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value as any)}
              className="bg-industrial-950 border border-industrial-800 text-white p-1 text-xs font-mono"
            >
              {units.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* SIF Toggle */}
          <button
            onClick={() => setSifOnly(!sifOnly)}
            className={`px-2.5 py-1 border text-xs font-mono transition ${
              sifOnly
                ? 'bg-hazard-red text-white border-red-500 font-bold shadow-hazard-red'
                : 'bg-industrial-950 text-industrial-400 border-industrial-800 hover:text-white'
            }`}
          >
            {sifOnly ? 'SIF POTENTIAL ONLY [ACTIVE]' : 'FILTER SIF POTENTIAL'}
          </button>
        </div>

        <div className="text-[11px] text-industrial-400 font-mono">
          SHOWING <strong className="text-white">{filteredReports.length}</strong> OF {reports.length} ARCHIVED RECORDS
        </div>
      </div>

      {/* Reports Table */}
      <div className="p-4 bg-industrial-900 border border-industrial-800 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-industrial-800 bg-industrial-950 text-industrial-400 text-[10px] uppercase tracking-wider">
                <th className="p-2.5">REPORT ID</th>
                <th className="p-2.5">DATE / TIME</th>
                <th className="p-2.5">UNIT</th>
                <th className="p-2.5">EQUIPMENT</th>
                <th className="p-2.5">ACTIVITY</th>
                <th className="p-2.5">AI ONE-LINE SUMMARY</th>
                <th className="p-2.5">MAPPED IOGP RULE</th>
                <th className="p-2.5 text-center">SIF SCORE</th>
                <th className="p-2.5 text-center">SEVERITY</th>
                <th className="p-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-850 text-xs">
              {filteredReports.map((report) => {
                const isCritical = report.severity === 'CRITICAL';

                return (
                  <tr
                    key={report.report_id}
                    onClick={() => onSelectReport(report)}
                    className="hover:bg-industrial-850 transition cursor-pointer"
                  >
                    <td className="p-2.5 font-bold text-white whitespace-nowrap">
                      {report.report_id}
                    </td>
                    <td className="p-2.5 text-industrial-400 text-[11px] whitespace-nowrap font-mono">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-2.5 font-bold text-hazard-cyan whitespace-nowrap">
                      {report.unit}
                    </td>
                    <td className="p-2.5 text-industrial-200 font-mono text-[11px] whitespace-nowrap">
                      {report.equipment}
                    </td>
                    <td className="p-2.5 text-industrial-300 whitespace-nowrap">
                      {report.activity}
                    </td>
                    <td className="p-2.5 font-sans text-industrial-200 max-w-sm line-clamp-1">
                      {report.ai_summary}
                    </td>
                    <td className="p-2.5 text-hazard-amber font-medium whitespace-nowrap text-[11px]">
                      {report.iogp_rule}
                    </td>
                    <td className="p-2.5 text-center font-bold text-hazard-red whitespace-nowrap font-mono">
                      {report.sif_score}/5
                    </td>
                    <td className="p-2.5 text-center whitespace-nowrap">
                      <IndustrialBadge 
                        variant={isCritical ? 'critical' : report.severity === 'HIGH' ? 'amber' : 'cyan'} 
                        size="xs"
                      >
                        {report.severity}
                      </IndustrialBadge>
                    </td>
                    <td className="p-2.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReport(report);
                        }}
                        className="px-2 py-0.5 bg-industrial-800 hover:bg-industrial-750 text-hazard-cyan border border-industrial-700 text-[10px] font-mono transition"
                      >
                        INVESTIGATE &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
