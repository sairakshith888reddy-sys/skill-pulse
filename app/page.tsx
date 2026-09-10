"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Shield, Brain, Cloud, Code, Blocks, Cpu, 
  Smartphone, Palette, Wrench, Database, CheckCircle, Gamepad,
  TrendingUp, TrendingDown, Layers
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvvwnjbejhhfhodwrhis.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_krHDJfg-y8ylEvpsFp3pCA_KIoQxKPz";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ICON_MAP: Record<string, any> = {
  Shield, Brain, Cloud, Code, Blocks, Cpu,
  Smartphone, Palette, Wrench, Database, CheckCircle, Gamepad
};

export default function Home() {
  const [domains, setDomains] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      const { data, error } = await supabase.from("domains").select("*");
      if (error) {
        console.error("Error fetching domains:", error.message);
      } else if (data && data.length > 0) {
        setDomains(data);
        setSelectedDomain(data[0]); // Select first department by default
      }
      setLoading(false);
    };

    fetchDomains();

    const channel = supabase
      .channel("domains-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "domains" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setDomains((prev) =>
              prev.map((d) => (d.name === payload.new.name ? { ...d, ...payload.new } : d))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
        Syncing market skills...
      </div>
    );
  }

  return (
    <main className="p-8 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-4 border-slate-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Skill Gap Pulse</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time comparison between industry market demand and training curriculums.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Live Market Stream
          </span>
        </div>
      </div>

      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
        SELECT DEPARTMENT ({domains.length} ACTIVE)
      </h2>

      {/* Grid of All Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {domains.map((domain) => {
          const IconComponent = ICON_MAP[domain.icon_name] || Layers;
          const isSelected = selectedDomain?.name === domain.name;

          return (
            <div
              key={domain.name}
              onClick={() => setSelectedDomain(domain)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{domain.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {domain.open_jobs?.toLocaleString() ?? "N/A"} Open Roles
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${
                    domain.change_24h >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {domain.change_24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {domain.change_24h > 0 ? `+${domain.change_24h}%` : `${domain.change_24h}%`}
                  </div>
                  <p className="text-xs text-rose-400/90 font-medium mt-1">
                    {domain.gap_percentage}% Skill Deficit
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Analysis View for Selected Department */}
      {selectedDomain && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800/80 pb-4">
            <h2 className="text-xl font-bold">
              Detailed Analysis: <span className="text-cyan-400">{selectedDomain.name}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {selectedDomain.roles_data?.length || 0} Roles Mapped
            </span>
          </div>

          {selectedDomain.roles_data && selectedDomain.roles_data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedDomain.roles_data.map((role: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <h4 className="font-semibold text-sm mb-2">{role.title}</h4>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Demand Index:</span>
                    <span className="text-emerald-400 font-bold">{role.demand}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mb-3 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full" 
                      style={{ width: `${role.demand}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500">Core Skill: </span>
                    <span className="text-cyan-300 font-medium">{role.topSkill}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              No detailed roles mapped for this department yet. Run the updated sync script!
            </div>
          )}
        </div>
      )}
    </main>
  );
}