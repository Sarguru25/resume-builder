import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      default: "Untitled Resume",
    },

    public: {
      type: Boolean,
      default: false,
    },

    template: {
      type: String,
      default: "classic",
    },

    accentColor: {
      type: String,
      default: "#000000",
    },

    professional_summary: {
      type: String,
      default: "",
    },

    /* ================= PERSONAL INFO ================= */
    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    /* ================= SKILLS ================= */
    skills: {
      technicalSkills: { type: [String], default: [] },
      softSkills: { type: [String], default: [] },
    },

    /* ================= EXPERIENCE ================= */
    experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean, default: false },
      },
    ],

    /* ================= PROJECTS ================= */
    projects: [
      {
        name: { type: String },
        type: { type: String },
        description: { type: String },
      },
    ],

    /* ================= EDUCATION ================= */
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        graduation_date: { type: String },
        gpa: { type: String },
      },
    ],

    /* ================= PARTICIPATIONS ================= */
    participations: [
      {
        title: { type: String },
        organization: { type: String },
        year: { type: String },
        description: { type: String },
      },
    ],

    /* ================= ACHIEVEMENTS ================= */
    achievements: [
      {
        title: { type: String },
        year: { type: String },
        description: { type: String },
      },
    ],

    /* ================= LANGUAGES ================= */
    languages: [
      {
        language: { type: String },
        proficiency: {
          type: String,
          enum: ["Basic", "Intermediate", "Fluent", "Native"],
        },
      },
    ],

    /* ================= CUSTOM SECTIONS ================= */
    custom_sections: [
      {
        section_title: { type: String },
        items: [
          {
            title: { type: String },
            description: { type: String },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;
