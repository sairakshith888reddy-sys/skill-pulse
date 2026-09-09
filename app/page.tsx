'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yvvwnjbejhhfhodwrhis.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_krHDJfg-y8ylEvpsFp3pCA_KIoQxKPz';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fallback data ensuring immediate UI rendering
const defaultDomains = [
  { id: 1, name: 'Cyber Security', open_jobs: 42522, change_24h: 3.5, gap_percentage: 28 },
  { id: 2, name: 'Mechanical CAD', open_jobs: 18416, change_24h: -1.2, gap_percentage: 15 }
];

const defaultRoles = [
  {
    id: 1,
    domain_name: 'Cyber Security',
    role: 'Cyber Security Specialist',
    demand_score: 88,
    required_skills: ['Network Security', 'Ethical Hacking', 'SIEM', 'Cloud Security', 'Incident Response'],
    curriculum_skills: ['Network Security', 'Ethical Hacking', 'SIEM'],
    gap_skills: ['Cloud Security', 'Incident Response']
  },
  {
    id: 2,
    domain_name: 'Mechanical CAD',
    role: 'CAD Design Engineer',
    demand_score: 75,
    required_skills: ['SolidWorks', 'AutoCAD', 'FEA Analysis', 'GD&T', '3D Modeling'],
    curriculum_skills: ['SolidWorks', 'AutoCAD', '3D Modeling'],
    gap_skills: ['FEA Analysis', 'GD&T']
  }
];

export default function Home() {
  const [domains, setDomains] = useState<any[]>(defaultDomains);
  const [roles, setRoles] = useState<any[]>(defaultRoles);
  const [selectedDomain, setSelectedDomain] = useState<string>('Cyber Security');

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: domainData } = await supabase.from('domains').select('*');
        const { data: roleData } = await supabase.from('role_skills').select('*');
        if (domainData && domainData.length > 0) {
          setDomains(domainData);
          setSelectedDomain(domainData[0].name);
        }
        if (roleData && roleData.length > 0) setRoles(roleData);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }
    fetchData();
  }, []);

  // Filter roles based on selected department/domain tab
  const filteredRoles = roles.filter(
    (r) =>
      (r.domain_name || '').toLowerCase() === selectedDomain.toLowerCase() ||
      (r.domain || '').toLowerCase() === selectedDomain.toLowerCase() ||
      r.role.toLowerCase().includes(selectedDomain.toLowerCase().split(' ')[0])
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-2 text-cyan-400">Live Skill Gap Pulse</h1>
      <p className="text-slate-400 mb-8">Real-time comparison between industry market demand and training curriculums.</p>

      {/* Interactive Domain Tabs */}
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Department</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {domains.map((d) => {
          const isSelected = selectedDomain.toLowerCase() === d.name.toLowerCase();
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.name)}
              className={`p-4 rounded-xl flex justify-between items-center transition-all cursor-pointer border text-left ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                <h2 className="font-semibold text-lg text-slate-100">{d.name}</h2>
                <p className="text-xs text-slate-400">{(d.open_jobs || 0).toLocaleString()} Open Roles</p>
              </div>
              <div className="text-right">
                <span className={`flex items-center text-sm font-bold ${d.change_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {d.change_24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {d.change_24h}%
                </span>
                <p className="text-xs text-rose-400 font-mono mt-1">{d.gap_percentage}% Skill Deficit</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Domain Breakdown */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold">
          Detailed Analysis: <span className="text-cyan-400">{selectedDomain}</span>
        </h2>
        <span className="text-xs text-slate-400">{filteredRoles.length} Roles Active</span>
      </div>

      {filteredRoles.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
          No detailed roles mapped for this department yet.
        </div>
      ) : (
        filteredRoles.map((r) => {
          const requiredSkills = r.required_skills || r.required_concepts || [];
          const curriculumSkills = r.curriculum_skills || r.matched_skills || [];
          const gapSkills = r.gap_skills || [];
          const demandScore = r.demand_score || 0;

          return (
            <div key={r.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-4">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{r.role || r.role_name}</h3>
                  <p className="text-xs text-slate-400">Demand Score: {demandScore}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {curriculumSkills.length} Taught
                  </span>
                  <p className="text-xs text-rose-400">{gapSkills.length} Skill Gaps</p>
                </div>
              </div>

              <h4 className="text-sm font-semibold mb-2 text-slate-300">Required Industry Skills vs. Curriculum Match:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {requiredSkills.map((skill: string, idx: number) => {
                  const isMatched = curriculumSkills.includes(skill);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded text-xs border ${
                        isMatched
                          ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800 text-rose-300'
                      }`}
                    >
                      <span>{skill}</span>
                      {isMatched ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </main>
  );
}