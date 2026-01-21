import { Plus, Sparkles, X } from "lucide-react";
import React, { useState } from "react";

const SkillForm = ({ data = { technicalSkills: [], softSkills: [] }, onChange }) => {
  const [activeTab, setActiveTab] = useState("technical"); // "technical" or "soft"
  const [newSkill, setNewSkill] = useState("");

  // Safety: ensure skills is always an array
  const skills =
    activeTab === "technical"
      ? data.technicalSkills || []
      : data.softSkills || [];

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updatedData = { ...data };
      if (activeTab === "technical") {
        updatedData.technicalSkills = [...skills, trimmed];
      } else {
        updatedData.softSkills = [...skills, trimmed];
      }
      onChange(updatedData);
      setNewSkill("");
    }
  };

  const removeSkill = (indexToRemove) => {
    const updatedData = { ...data };
    if (activeTab === "technical") {
      updatedData.technicalSkills = skills.filter((_, i) => i !== indexToRemove);
    } else {
      updatedData.softSkills = skills.filter((_, i) => i !== indexToRemove);
    }
    onChange(updatedData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">Skills</h3>
        <p className="text-sm text-gray-500">Add your skills and categorize them.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("technical")}
          className={`px-3 py-1 rounded-lg font-medium ${
            activeTab === "technical" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Technical
        </button>
        <button
          onClick={() => setActiveTab("soft")}
          className={`px-3 py-1 rounded-lg font-medium ${
            activeTab === "soft" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Soft
        </button>
      </div>

      {/* Add Skill Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={`Enter a ${activeTab} skill`}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={addSkill}
          disabled={!newSkill.trim()}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {/* Skills List */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No {activeTab === "technical" ? "technical" : "soft"} skills added yet.</p>
          <p className="text-sm">Add skills to make your resume stand out.</p>
        </div>
      )}
    </div>
  );
};

export default SkillForm;
