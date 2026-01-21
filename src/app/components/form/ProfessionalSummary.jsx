import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const ProfessionalSummary = ({ data, onChange, setResumeData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (!data?.trim()) {
      toast.error("Please write a summary first");
      return;
    }

    try {
      setIsGenerating(true);

      const res = await fetch("/api/ai/enhance-pro-sum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userContent: data, // send RAW content only
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setResumeData((prev) => ({
        ...prev,
        professional_summary: result.resume,
      }));

      toast.success("Professional summary enhanced!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add a professional summary to highlight your skills and experience.
          </p>
        </div>

        <button
          onClick={generateSummary}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Generating..." : "AI Enhance"}
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />

        <p className="text-xs text-gray-500 text-center mt-2">
          Tips: Keep it concise (3–4 sentences) and focused on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
