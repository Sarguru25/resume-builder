import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

/* =========================
   Sortable Wrapper (same as ModernTemplate)
========================= */
const SortableItem = ({ index, total, onMoveUp, onMoveDown, children }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          position: "absolute",
          left: "-28px",
          top: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.2s",
          zIndex: 10,
        }}
        className="print:hidden"
      >
        <GripVertical size={14} color="#9ca3af" />
        {index > 0 && <button onClick={onMoveUp} style={btnStyle}>↑</button>}
        {index < total - 1 && <button onClick={onMoveDown} style={btnStyle}>↓</button>}
      </div>
      {children}
    </div>
  );
};

const btnStyle = {
  border: "none",
  background: "#e5e7eb",
  borderRadius: "4px",
  fontSize: "10px",
  cursor: "pointer",
  padding: "2px 4px",
  lineHeight: 1,
};

/* =========================
   Enhanced MinimalImageTemplate
========================= */
const MinimalImageTemplate = ({
  data,
  accentColor = "#2563eb",
  sectionTypographies = {},
  leftSectionOrder: propLeftOrder,   // optional override
  rightSectionOrder: propRightOrder, // optional override
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  // ----- Helper for date formatting (kept from original) -----
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // ----- Safely access nested data -----
  const personalInfo = data.personal_info || {};
  const skills = data.skills || { technicalSkills: [], softSkills: [] };
  const education = data.education || [];
  const experience = data.experience || [];
  const projects = data.projects || [];
  const languages = data.languages || [];
  const participations = data.participations || [];
  const achievements = data.achievements || [];

  // ----- Build initial section keys for left and right columns -----
  const defaultLeft = useMemo(
    () => [
      "contact",
      "education",
      "technical_skills",
      "soft_skills",
      "languages",
    ],
    []
  );

  const customKeys = useMemo(
    () => data?.custom_sections?.map((_, i) => `custom_${i}`) || [],
    [data?.custom_sections]
  );

  const defaultRight = useMemo(
    () => [
      "professional_summary",
      "experience",
      "projects",
      "participations",
      "achievements",
      ...customKeys,
    ],
    [customKeys]
  );

  const [leftSections, setLeftSections] = useState(propLeftOrder || defaultLeft);
  const [rightSections, setRightSections] = useState(propRightOrder || defaultRight);

  // Move section within a column
  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  // ----- Typography merging (same as ModernTemplate) -----
  const baseTypography = {
    header: { fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.5 },
  };
  const merged = { ...baseTypography, ...sectionTypographies };

  const getStyles = (key) => {
    const effectiveKey =
      key === "technical_skills" || key === "soft_skills" ? "skills" : key;
    const t = { ...merged.header, ...merged[effectiveKey] };
    const baseFontSize = t.fontSize;

    return {
      page: {
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        margin: "0 auto",
        background: "#fff",
        color: "#1f2937",
        fontFamily: t.fontFamily,
      },
      // Reusable border-left style (accent line)
      borderL: {
        borderLeft: `2px solid ${accentColor}`,
        paddingLeft: "0.75rem",
        marginBottom: "0.6rem",
        paddingTop: "0.1rem",
        paddingBottom: "0.1rem",
      },
      textSm: { fontSize: baseFontSize * 0.875 },
      textXs: { fontSize: baseFontSize * 0.75, color: "#6b7280" },
      between: { display: "flex", justifyContent: "space-between" },
      // Section title styling (keeps original minimal look but with accent color)
      sectionTitle: {
        fontSize: baseFontSize * 0.875,
        fontWeight: 600,
        letterSpacing: "0.05em",
        color: accentColor,
        marginBottom: "0.75rem",
      },
    };
  };

  const styles = getStyles("header");

  // ----- Render left column sections -----
  const renderLeft = (key, index) => {
    const s = getStyles(key);
    const withSortable = (content) => (
      <SortableItem
        key={key}
        index={index}
        total={leftSections.length}
        onMoveUp={() => move(leftSections, setLeftSections, index, "up")}
        onMoveDown={() => move(leftSections, setLeftSections, index, "down")}
      >
        {content}
      </SortableItem>
    );

    switch (key) {
      case "contact":
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
              CONTACT
            </h2>
            <div className="space-y-2 text-sm">
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} style={{ color: accentColor }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} style={{ color: accentColor }} />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: accentColor }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin size={14} style={{ color: accentColor }} />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe size={14} style={{ color: accentColor }} />
                  <span>{personalInfo.website}</span>
                </div>
              )}
            </div>
          </section>
        );

      case "education":
        if (!hasItems(education)) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
              EDUCATION
            </h2>
            <div className="space-y-4 text-sm">
              {education.map((edu, i) => (
                <div key={i} style={s.borderL}>
                  <p className="font-semibold uppercase">{edu.degree}</p>
                  <p className="text-zinc-600">{edu.institution}</p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(edu.graduation_date)}
                  </p>
                  {edu.gpa && <p className="text-xs text-zinc-500">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      case "technical_skills":
        if (!hasItems(skills.technicalSkills)) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
              TECHNICAL SKILLS
            </h2>
            <div>
              {skills.technicalSkills.map((skill, i) => (
                <div key={i} style={s.borderL}>
                  <span style={s.textSm}>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case "soft_skills":
        if (!hasItems(skills.softSkills)) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
              SOFT SKILLS
            </h2>
            <div>
              {skills.softSkills.map((skill, i) => (
                <div key={i} style={s.borderL}>
                  <span style={s.textSm}>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case "languages":
        if (!hasItems(languages)) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
              LANGUAGES
            </h2>
            <div>
              {languages.map((lang, i) => (
                <div key={i} style={s.borderL}>
                  <span style={s.textSm}>
                    {lang.language} {lang.proficiency && `(${lang.proficiency})`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // ----- Render right column sections -----
  const renderRight = (key, index) => {
    const s = getStyles(key);
    const withSortable = (content) => (
      <SortableItem
        key={key}
        index={index}
        total={rightSections.length}
        onMoveUp={() => move(rightSections, setRightSections, index, "up")}
        onMoveDown={() => move(rightSections, setRightSections, index, "down")}
      >
        {content}
      </SortableItem>
    );

    switch (key) {
      case "professional_summary":
        if (!data.professional_summary) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest mb-3" style={{ color: accentColor }}>
              SUMMARY
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              {data.professional_summary}
            </p>
          </section>
        );

      case "experience":
        if (!hasItems(experience)) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: accentColor }}>
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <div key={i} style={s.borderL}>
                  <div style={s.between}>
                    <h3 className="font-semibold text-zinc-900">{exp.position}</h3>
                    <span className="text-xs text-zinc-500">
                      {formatDate(exp.start_date)} –{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: accentColor }}>
                    {exp.company}
                  </p>
                  {exp.description && (
                    <ul className="list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1">
                      {exp.description.split("\n").map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        if (!hasItems(projects)) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
              PROJECTS
            </h2>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i} style={s.borderL}>
                  <h3 className="text-md font-medium text-zinc-800">{proj.name}</h3>
                  {proj.type && <p className="text-sm mb-1" style={{ color: accentColor }}>{proj.type}</p>}
                  {proj.description && (
                    <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1">
                      {proj.description.split("\n").map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "participations":
        if (!hasItems(participations)) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
              PARTICIPATIONS
            </h2>
            <div className="space-y-4">
              {participations.map((part, i) => (
                <div key={i} style={s.borderL}>
                  <h3 className="font-semibold">{part.title}</h3>
                  {part.organization && <p className="text-sm text-zinc-600">{part.organization}</p>}
                  {part.description && <p className="text-sm text-zinc-700">{part.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      case "achievements":
        if (!hasItems(achievements)) return null;
        return withSortable(
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
              ACHIEVEMENTS
            </h2>
            <div className="space-y-4">
              {achievements.map((ach, i) => (
                <div key={i} style={s.borderL}>
                  <h3 className="font-semibold">{ach.title}</h3>
                  {ach.description && <p className="text-sm text-zinc-700">{ach.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );

      default:
        if (key.startsWith("custom_")) {
          const idx = Number(key.split("_")[1]);
          const cs = data.custom_sections?.[idx];
          if (!cs || !hasItems(cs.items)) return null;

          return withSortable(
            <section className="mb-8">
              <h2 className="text-sm uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
                {cs.section_title}
              </h2>
              <div className="space-y-4">
                {cs.items.map((item, i) => (
                  <div key={i} style={s.borderL}>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.description && <p className="text-sm text-zinc-700">{item.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        }
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <div className="grid grid-cols-3 h-full">
        {/* Profile Image (fixed, not sortable) */}
        <div className="col-span-1 py-10">
          {personalInfo.image && (
            <div className="mb-6">
              <img
                src={personalInfo.image}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mx-auto"
                style={{ background: accentColor + "70" }}
              />
            </div>
          )}
        </div>

        {/* Name + Title (fixed, not sortable) */}
        <div className="col-span-2 flex flex-col justify-center py-10 px-8">
          <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
            {personalInfo.full_name || "Your Name"}
          </h1>
          <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
            {personalInfo.profession || "Profession"}
          </p>
        </div>

        {/* Left Sidebar (sortable sections) */}
        <aside className="col-span-1 border-r border-zinc-400 p-6 pt-0">
          {leftSections.map(renderLeft)}
        </aside>

        {/* Right Main Content (sortable sections) */}
        <main className="col-span-2 p-8 pt-0">
          {rightSections.map(renderRight)}
        </main>
      </div>
    </div>
  );
};

export default React.memo(MinimalImageTemplate);