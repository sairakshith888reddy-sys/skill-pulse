'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [domains, setDomains] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: domainData } = await supabase.from('domains').select('*');
      const { data: roleData } = await supabase.from('role_skills').select('*');
      if (domainData) setDomains(domainData);
      if (roleData) setRoles(roleData);
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-2 text-cyan-400">Live Skill Gap Pulse</h1>
      <p className="text-slate-400 mb-8">Real-time comparison between industry market demand and training curriculums.</p>

      {/* Live Market Ticker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {domains.map((d) => (
          <div key={d.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg">{d.name}</h2>
              <p className="text-xs text-slate-400">{d.open_jobs?.toLocaleString()} Open Roles</p>
            </div>
            <div className="text-right">
              <span className={`flex items-center text-sm font-bold ${d.change_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {d.change_24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {d.change_24h}%
              </span>
              <p className="text-xs text-rose-400 font-mono mt-1">{d.gap_percentage}% Skill Deficit</p>
            </div>
          </div>
        ))}
      </div>

      {/* Role Skill Breakdown */}
      <h2 className="text-xl font-bold mb-4">Detailed Role Analysis</h2>
      {roles.map((r) => (
        <div key={r.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-4">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold">{r.role_name}</h3>
              <p className="text-xs text-slate-400">{r.domain_name} | {r.total_openings?.toLocaleString()} Jobs</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold text-emerald-400">{r.satisfaction_rate}% Satisfaction</span>
              <p className="text-xs text-rose-400">{100 - r.satisfaction_rate}% Unmatched</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold mb-2 text-slate-300">Required Skills vs. Curriculum Match:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {r.required_concepts?.concat(r.required_tools).map((skill: string, idx: number) => {
              const isMatched = r.matched_skills?.includes(skill);
              return (
                <div key={idx} className={`flex items-center justify-between p-2 rounded text-xs border ${isMatched ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
                  <span>{skill}</span>
                  {isMatched ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </main>
  );
}