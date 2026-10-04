import React, { useState } from 'react';
import { 
  Globe, 
  Play, 
  Terminal, 
  RefreshCw, 
  Cloud 
} from 'lucide-react';
import type { ScrapingJob } from '../data/hospitalData';

interface ScrapingViewProps {
  scrapingJobs: ScrapingJob[];
  onTriggerJob: (id: string) => void;
}

export const ScrapingView: React.FC<ScrapingViewProps> = ({ scrapingJobs, onTriggerJob }) => {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYSTEM] Shishutaa Automation Pipeline Engine v4.2 Initialized.',
    '[PLAYWRIGHT] Launching Chromium headless instance in AWS ECS container...',
    '[SELENIUM] Authenticating with Star Health TPA API Gateway... Success (HTTP 200).',
    '[SCRAPY] Syncing ICD-10 medical coding database with WHO global endpoints.',
    '[TWILIO] Webhook listener listening on port 443 with SSL certificate.'
  ]);

  const handleRunManualScrape = (job: ScrapingJob) => {
    setActiveJobId(job.id);
    onTriggerJob(job.id);

    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      `[${timestamp}] [MANUAL TRIGGER] Triggered crawler for '${job.targetName}' via ${job.crawlerEngine}.`,
      `[${timestamp}] [CHROMIUM] Navigating to target DOM hierarchy...`,
      `[${timestamp}] [PARSER] Extracted 42 new insurance pre-authorization records.`,
      `[${timestamp}] [POSTGRES] Committed data payload to Shishutaa PostgreSQL DB.`,
      ...prev
    ]);

    setTimeout(() => {
      setActiveJobId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D1B22] flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#8C2237]" /> Web Scraping & Cloud Automation Pipelines
          </h2>
          <p className="text-xs text-slate-500">Playwright, Selenium Grid & Scrapy bots fetching insurance tariffs, ICD-10 codes & webhooks</p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
          <Cloud className="w-4 h-4 text-teal-600" /> AWS Docker Container Cluster Active
        </span>
      </div>

      {/* Crawlers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scrapingJobs.map((job) => (
          <div key={job.id} className="shishutaa-card p-6 rounded-3xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-[#2D1B22] text-base">{job.targetName}</h4>
                <p className="text-xs text-teal-700 font-mono font-bold mt-0.5">Engine: {job.crawlerEngine}</p>
              </div>

              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                {job.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] font-semibold block">Records Extracted</span>
                <span className="font-black text-slate-900 text-base">{job.recordsExtracted.toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] font-semibold block">Health Score</span>
                <span className="font-black text-teal-700 text-base">{job.healthScore}% Optimal</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 text-[11px] font-medium">Last Sync: {job.lastRun}</span>

              <button
                onClick={() => handleRunManualScrape(job)}
                disabled={activeJobId === job.id}
                className="shishutaa-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
              >
                {activeJobId === job.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Crawling...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" /> Trigger Scrape
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Console */}
      <div className="shishutaa-card p-6 rounded-3xl bg-slate-900 text-emerald-400 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Terminal className="w-4 h-4 text-rose-400" /> Playwright / Selenium Web Crawler Telemetry Logs
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          </div>
        </div>

        <div className="h-48 overflow-y-auto space-y-1.5 text-xs leading-relaxed pr-2">
          {terminalLogs.map((log, idx) => (
            <p key={idx} className="hover:bg-slate-800/50 px-1 py-0.5 rounded">
              {log}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
};
