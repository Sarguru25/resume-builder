"use client";

import { useState } from "react";

export default function ATSChecker({ resumeId }) {
  const [role, setRole] = useState("Frontend Developer");
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkScore = async () => {
    setLoading(true);

    const res = await fetch("/api/ats-score", {
      method: "POST",
      body: JSON.stringify({ resumeId, role }),
    });

    const data = await res.json();
    setScoreData(data);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-semibold">ATS Resume Checker</h2>

      {/* ROLE SELECT */}
      <select
        className="border p-2 rounded w-full"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option>Frontend Developer</option>
        <option>Backend Developer</option>
        <option>Full Stack Developer</option>
      </select>

      <button
        onClick={checkScore}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Check ATS Score"}
      </button>

      {scoreData && (
        <div className="space-y-4">
          {/* SCORE */}
          <div className="text-center">
            <h3 className="text-3xl font-bold">{scoreData.score}/100</h3>
            <p className="text-gray-500">ATS Score</p>
          </div>

          {/* MATCHED */}
          <div>
            <h4 className="font-semibold">Matched Keywords</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {scoreData.matchedKeywords.map((k) => (
                <span
                  key={k}
                  className="bg-green-100 text-green-700 px-2 py-1 rounded"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* MISSING */}
          <div>
            <h4 className="font-semibold">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {scoreData.missingKeywords.slice(0, 8).map((k) => (
                <span
                  key={k}
                  className="bg-red-100 text-red-700 px-2 py-1 rounded"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* TIPS */}
          <div>
            <h4 className="font-semibold">Improvement Tips</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {scoreData.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}