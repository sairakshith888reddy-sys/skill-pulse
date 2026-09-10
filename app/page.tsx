"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Shield, Brain, Cloud, Code, Blocks, Cpu, 
  Smartphone, Palette, Wrench, Database, CheckCircle, Gamepad,
  TrendingUp, TrendingDown, Layers, Search, ChevronRight,
  GraduationCap, Building2, AlertCircle, BookOpen
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvvwnjbejhhfhodwrhis.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_krHDJfg-y8ylEvpsFp3pCA_KIoQxKPz";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ICON_MAP: Record<string, any> = {
  "Cyber Security": Shield,
  "AI & Data Science": Brain,
  "Cloud & DevOps": Cloud,
  "Full Stack Web Dev": Code,
  "Blockchain & Web3": Blocks,
  "Internet of Things": Cpu,
  "Internet of Things (IoT)": Cpu,
  "Mobile App Development": Smartphone,
  "UI UX Design": Palette,
  "UI/UX & Product Design": Palette,
  "Mechanical CAD": Wrench,
  "Data Engineering": Database,
  "QA Automation": CheckCircle,
  "Game Development": Gamepad,
  "Robotics": Cpu,
};

// Dynamic mapping of roles, required skills, and government/institutional coverage
const DOMAIN_ROLES_DATA: Record<string, any[]> = {
  "Cyber Security": [
    {
      title: "SOC Analyst (L1/L2)",
      openings: "8,420",
      industrySkills: ["Splunk / SIEM", "Wireshark", "Threat Hunting", "Log Analysis"],
      govtCurriculum: ["Basic Networking (NPTEL)", "Cyber Hygiene (C-DAC)"],
      institutionsTeaching: ["IIT Madras (Cyber Defense)", "C-DAC Certified Cyber Security"],
      gapNote: "Institutions teach theoretical concepts, missing hands-on SIEM and live incident response tools."
    },
    {
      title: "Penetration Tester",
      openings: "5,110",
      industrySkills: ["Metasploit", "Burp Suite", "OWASP Top 10", "Python Scripting"],
      govtCurriculum: ["Ethical Hacking Fundamentals (Swayam)"],
      institutionsTeaching: ["IIT Kanpur (Cybersecurity Centre of Excellence)"],
      gapNote: "High demand for cloud pentesting and automated vulnerability exploitation not covered in college syllabi."
    }
  ],
  "AI & Data Science": [
    {
      title: "LLM / GenAI Specialist",
      openings: "12,300",
      industrySkills: ["PyTorch", "LangChain / LlamaIndex", "Fine-tuning (LoRA)", "Vector DBs (Pinecone)"],
      govtCurriculum: ["AI & ML Basics (IndiaAI Portal)", "Data Structures in Python"],
      institutionsTeaching: ["IIT Hyderabad (B.Tech AI)", "IISc AI Research Lab"],
      gapNote: "Industry requires GenAI orchestration & vector search, whereas universities teach traditional ML algorithms."
    },
    {
      title: "MLOps Engineer",
      openings: "6,450",
      industrySkills: ["MLflow", "Kubeflow", "Docker / K8s", "Feature Stores"],
      govtCurriculum: ["Software Engineering Foundations"],
      institutionsTeaching: ["IIT Kharagpur Data Science Program"],
      gapNote: "Zero MLOps and deployment pipelines included in standard university CS curriculum."
    }
  ],
  "Cloud & DevOps": [
    {
      title: "DevOps Engineer",
      openings: "14,200",
      industrySkills: ["Kubernetes", "Docker", "Terraform (IaC)", "CI/CD Pipelines"],
      govtCurriculum: ["Operating Systems & Linux Basics"],
      institutionsTeaching: ["IIIT Bangalore (Cloud Architecture)"],
      gapNote: "Universities teach OS theoretical concepts; industry demands production multi-cloud automation."
    }
  ],
  "Full Stack Web Dev": [
    {
      title: "Next.js / React Specialist",
      openings: "11,800",
      industrySkills: ["Next.js 14/15", "TypeScript", "Tailwind CSS", "Prisma / PostgreSQL"],
      govtCurriculum: ["HTML/CSS/JS Basics (Swayam)", "PHP & MySQL"],
      institutionsTeaching: ["State Technical Universities"],
      gapNote: "University syllabi still focus on PHP/Legacy Java while market demands modern SSR and TypeScript."
    }
  ]
};

// Fallback roles for domains not explicitly in the map
const DEFAULT_ROLES = [
  {
    title: "Senior Domain Specialist",
    openings: "4,500",
    industrySkills: ["System Architecture", "Cloud Integration", "Automation Pipelines"],
    govtCurriculum: ["Fundamental Engineering Sciences"],
    institutionsTeaching: ["National Institutes of Technology (NITs)", "IITs"],
    gapNote: "Curriculum updates lag behind industry toolchains by 3 to 5 years."
  },
  {
    title: "Associate Engineer",
    openings: "8,200",
    industrySkills: ["Toolchain Operations", "Testing Frameworks", "Git Collaboration"],
    govtCurriculum: ["Basic Programming & Laboratory Practicals"],
    institutionsTeaching: ["State Government Engineering Colleges"],
    gapNote: "Lack of industry-sponsored practical lab projects."
  }
];

export default function Home() {
  const [domains, setDomains] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      const { data, error } = await supabase.from("domains").select("*");
      if (error) {
        console.error("Error fetching domains:", error.message);
      } else if (data && data.length > 0) {
        setDomains(data);
        setSelectedDomain(data[0]);
        const initialRoles = DOMAIN_ROLES_DATA[data[0].name] || DEFAULT_ROLES;
        setSelectedRole(initialRoles[0]);
      }
      setLoading(false);
    };

    fetchDomains();

    const channel = supabase
      .channel("realtime-domains")
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

  const handleSelectDomain = (domain: any) => {
    setSelectedDomain(domain);
    const roles = DOMAIN_ROLES_DATA[domain.name] || DEFAULT_ROLES;
    setSelectedRole(roles[0]); // Default to first role in selected domain
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        Syncing market skills...
      </div>
    );
  }

  const currentRoles = selectedDomain
    ? DOMAIN_ROLES_DATA[selectedDomain.name] || DEFAULT_ROLES
    : [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b pb-5 border-slate-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Live Skill Gap Pulse</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time comparison between industry market demand and institutional training curriculums.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Live Market Stream
          </span>
        </div>
      </div>

      {/* Department Cards Grid */}
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
        SELECT DEPARTMENT ({domains.length} ACTIVE)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {domains.map((domain) => {
          const IconComponent = ICON_MAP[domain.name] || Layers;
          const isSelected = selectedDomain?.name === domain.name;

          return (
            <button
              key={domain.name}
              type="button"
              onClick={() => handleSelectDomain(domain)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 w-full focus:outline-none ${
                isSelected
                  ? "bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{domain.name}</h3>
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
                  <p className="text-xs text-rose-400 font-medium mt-1">
                    {domain.gap_percentage}% Deficit
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Drill Down View: Department -> Roles -> Skills vs Institutions */}
      {selectedDomain && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Department Drill Down:</span>
              <span className="text-cyan-400">{selectedDomain.name}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {currentRoles.length} Active Key Roles Mapped
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: List of Roles */}
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active Industry Roles
              </p>
              {currentRoles.map((role: any, idx: number) => {
                const isRoleSelected = selectedRole?.title === role.title;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                      isRoleSelected
                        ? "bg-cyan-950/40 border-cyan-500 text-white"
                        : "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <h4 className="font-semibold text-sm">{role.title}</h4>
                      <p className="text-xs text-emerald-400 mt-1">{role.openings} active listings</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isRoleSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed Skill & Government Curriculum Gap Analysis */}
            {selectedRole && (
              <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{selectedRole.title}</h3>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                      Demand: High
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Detailed gap pulse between production requirements and educational syllabi.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Industry Demanded Skills */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-3">
                      <Building2 className="w-4 h-4" />
                      Required Industry Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.industrySkills.map((skill: string, i: number) => (
                        <span key={i} className="text-xs bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 px-2.5 py-1 rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Government & College Syllabi */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-3">
                      <BookOpen className="w-4 h-4" />
                      Govt / Swayam / College Syllabus
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.govtCurriculum.map((curr: string, i: number) => (
                        <span key={i} className="text-xs bg-amber-950/40 border border-amber-800/60 text-amber-300 px-2.5 py-1 rounded-md">
                          {curr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Institutions & Colleges Currently Teaching */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider mb-2">
                    <GraduationCap className="w-4 h-4" />
                    Major Institutions / Programs Teaching This Domain
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {selectedRole.institutionsTeaching.map((inst: string, i: number) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>

                {/* Skill Deficit Analysis Note */}
                <div className="bg-rose-950/30 border border-rose-900/60 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Identified Curriculum Gap</h5>
                    <p className="text-xs text-rose-200/90 leading-relaxed">{selectedRole.gapNote}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}