"use client";

import { useState, useEffect } from "react";
import { atsRoles } from "@/lib/atsRoles";
import { CheckCircle2, XCircle, Lightbulb, Target, Loader2, Play } from "lucide-react";

export default function ATSChecker({ resumeId }) {
  const [role, setRole] = useState("Frontend Developer");
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const rolesList = Object.keys(atsRoles);

  const checkScore = async () => {
    setLoading(true);
    setScoreData(null);
    setAnimatedScore(0);

    try {
      const res = await fetch("/api/ats-score", {
        method: "POST",
        body: JSON.stringify({ resumeId, role }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      setScoreData(data);
    } catch (error) {
       console.error("Failed to check score", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scoreData) {
      let current = 0;
      const target = scoreData.score;
      const step = Math.max(1, Math.floor(target / 20));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(interval);
        } else {
          setAnimatedScore(current);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [scoreData]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 stroke-green-500";
    if (score >= 50) return "text-yellow-500 stroke-yellow-500";
    return "text-red-500 stroke-red-500";
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-8 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3"></div>

      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="bg-green-100 p-2.5 rounded-xl">
          <Target className="size-6 text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">ATS Match Check</h2>
          <p className="text-sm text-slate-500">See how well your resume matches the job description.</p>
        </div>
      </div>

      {/* ACTION AREA */}
      <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-inner">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Target Job Role</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow shadow-sm font-medium"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {rolesList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={checkScore}
          disabled={loading}
          className="w-full relative group overflow-hidden bg-green-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md shadow-green-600/20 hover:bg-green-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
             <>
               <Play className="size-5" />
               Run Analysis
             </>
          )}
        </button>
      </div>

      {/* RESULTS AREA */}
      {scoreData && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* CIRCULAR SCORE */}
          <div className="flex flex-col items-center justify-center py-4 relative">
             <div className="relative size-40 flex items-center justify-center">
                <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-100" strokeWidth="8" />
                   <circle 
                     cx="50" cy="50" r="45" fill="none" 
                     className={`${getScoreColor(animatedScore)} transition-all duration-500 ease-out`} 
                     strokeWidth="8" 
                     strokeDasharray={`${(animatedScore / 100) * 283} 283`}
                     strokeLinecap="round" 
                   />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                   <span className={`text-4xl font-extrabold ${getScoreColor(animatedScore).split(' ')[0]}`}>
                     {animatedScore}
                   </span>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Score</span>
                </div>
             </div>
             <p className="text-sm font-medium text-slate-500 mt-4 text-center max-w-xs">
               {animatedScore >= 80 ? "Outstanding match! You are highly likely to pass the ATS filter." : animatedScore >= 50 ? "Good start, but some improvements will guarantee an interview." : "Needs significant work to pass the ATS screen."}
             </p>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm">
             {/* MATCHED */}
            <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100">
              <h4 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                <CheckCircle2 className="size-5 text-green-600" />
                Matched Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {scoreData.matchedKeywords.length > 0 ? scoreData.matchedKeywords.map((k) => (
                  <span key={k} className="bg-white border border-green-200 text-green-600 font-medium px-3 py-1.5 rounded-lg shadow-sm capitalize">
                    {k}
                  </span>
                )) : <p className="text-green-700/70 italic">No keywords matched.</p>}
              </div>
            </div>

            {/* MISSING */}
            {scoreData.missingKeywords.length > 0 && (
              <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100">
                <h4 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                  <XCircle className="size-5 text-red-600" />
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scoreData.missingKeywords.slice(0, 10).map((k) => (
                    <span key={k} className="bg-white border border-red-200 text-red-600 font-medium px-3 py-1.5 rounded-lg shadow-sm capitalize">
                      {k}
                    </span>
                  ))}
                  {scoreData.missingKeywords.length > 10 && (
                    <span className="bg-transparent text-red-500 font-medium px-2 py-1.5">+ {scoreData.missingKeywords.length - 10} more</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* TIPS */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Lightbulb className="size-5 text-yellow-500" />
              Actionable Advice
            </h4>
            <div className="space-y-3">
              {scoreData.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <div className="mt-0.5 bg-white p-1 rounded-full shadow-sm border border-slate-200">
                     <Target className="size-3.5 text-green-500" />
                   </div>
                   <p className="text-slate-700 leading-relaxed text-sm font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}