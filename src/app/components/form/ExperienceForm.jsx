import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Briefcase, Plus, Sparkles, Trash2, Loader2 } from "lucide-react";
import api from "../../configs/api";
import toast from "react-hot-toast";

const ExperienceForm = ({ data = [], onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  // Add a new empty experience
  const addExperience = () => {
    const newExp = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...(data || []), newExp]);
  };

  // Remove experience at index
  const removeExperience = (index) => {
    onChange((data || []).filter((_, i) => i !== index));
  };

  // Update a field in a specific experience
  const updateExperience = (index, field, value) => {
    const updated = [...(data || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  // Call AI to enhance job description
  const generateExperience = async (index) => {
    const experience = data[index];
    if (!experience.position || !experience.company) {
      toast.error("Please fill Company and Position first.");
      return;
    }

    setGeneratingIndex(index);
    const prompt = `Enhance this job description: "${experience.description}" for the position of "${experience.position}" at "${experience.company}". Make it ATS-friendly and concise.`;

    try {
      const response = await api.post(
        "/api/ai/enhance-job-description",
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiText = response?.data?.resume || "";
      if (aiText) updateExperience(index, "description", aiText);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setGeneratingIndex(-1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your job experience.</p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {/* No experience added yet */}
      {(!data || data.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm text-gray-500">
            Click "Add Experience" to include your work experience.
          </p>
        </div>
      )}

      {/* Experience list */}
      {(data || []).map((experience, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          {/* Header with remove button */}
          <div className="flex items-start justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Experience #{index + 1}
            </h4>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          {/* Company / Position / Dates */}
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Company Name"
              value={experience.company || ""}
              onChange={(e) => updateExperience(index, "company", e.target.value)}
              className="px-3 py-2 text-sm rounded-lg"
            />
            <input
              type="text"
              placeholder="Job Title"
              value={experience.position || ""}
              onChange={(e) => updateExperience(index, "position", e.target.value)}
              className="px-3 py-2 text-sm rounded-lg"
            />
            <input
              type="month"
              placeholder="Start Date"
              value={experience.start_date || ""}
              onChange={(e) => updateExperience(index, "start_date", e.target.value)}
              className="px-3 py-2 text-sm rounded-lg"
            />
            <input
              type="month"
              placeholder="End Date"
              value={experience.end_date || ""}
              onChange={(e) => updateExperience(index, "end_date", e.target.value)}
              disabled={experience.is_current}
              className="px-3 py-2 text-sm rounded-lg disabled:text-gray-300"
            />
          </div>

          {/* Current job checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={experience.is_current || false}
              onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
              className="rounded px-4 py-2 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Currently working here</span>
          </label>

          {/* AI Enhance Job Description */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => generateExperience(index)}
              disabled={generatingIndex === index || !experience.position || !experience.company}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              {generatingIndex === index ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {generatingIndex === index ? "Generating..." : "Enhance with AI"}
            </button>
          </div>

          {/* Description textarea */}
          <textarea
            value={experience.description || ""}
            onChange={(e) => updateExperience(index, "description", e.target.value)}
            rows={4}
            className="w-full text-sm px-3 py-2 rounded-lg resize-none"
            placeholder="Describe your key responsibilities and achievements..."
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;
