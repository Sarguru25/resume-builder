import React, { useState, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  GripVertical,
} from "lucide-react";

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
   Enhanced Architect Template
========================= */
const ArchitectTemplate = ({
  data,
  accentColor = "#3B82F6",
  sectionTypographies = {},
  leftSectionOrder: propLeftOrder,   // optional array of section keys for left column
  rightSectionOrder: propRightOrder, // optional array for right column
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  // ----- Default section orders (if props not provided) -----
  const defaultLeft = useMemo(
    () => [
      "about",
      "technical_skills",
      "soft_skills",
      "languages",
      "certifications",
      "awards",
    ],
    []
  );

  const defaultRight = useMemo(
    () => [
      "experience",
      "education",
      "projects",
      "participations",
      "achievements",
      // custom sections will be appended later
    ],
    []
  );

  // ----- Add custom sections to the right column by default -----
  const customKeys = useMemo(
    () => data?.custom_sections?.map((_, i) => `custom_${i}`) || [],
    [data?.custom_sections]
  );

  const initialLeft = propLeftOrder || defaultLeft;
  const initialRight = propRightOrder || [...defaultRight, ...customKeys];

  const [leftSections, setLeftSections] = useState(initialLeft);
  const [rightSections, setRightSections] = useState(initialRight);

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

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;

    return {
      // Page container
      page: {
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "2rem",
        background: "#fff",
        color: "#1f2937",
        fontFamily: t.fontFamily,
      },
      // Two‑column layout
      columns: {
        display: "flex",
        gap: "2rem",
      },
      left: {
        width: "35%",
      },
      right: {
        width: "65%",
      },
      // Section container
      section: {
        marginBottom: "1.5rem",
        fontSize: baseFontSize,
        lineHeight: t.lineHeight,
        fontFamily: t.fontFamily,
      },
      h2: {
        fontSize: baseFontSize * 1.25,
        fontWeight: 600,
        color: accentColor,
        marginBottom: "0.75rem",
        letterSpacing: "0.5px",
      },
      textSm: { fontSize: baseFontSize * 0.875 },
      textXs: { fontSize: baseFontSize * 0.75, color: "#6b7280" },
      // Left accent border for items
      borderL: {
        borderLeft: `2px solid ${accentColor}`,
        paddingLeft: "0.75rem",
        marginBottom: "0.6rem",
        paddingTop: "0.1rem",
        paddingBottom: "0.1rem",
      },
      between: { display: "flex", justifyContent: "space-between" },
      // Header
      header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${accentColor}30`, // subtle border
        paddingBottom: "1rem",
        marginBottom: "1.5rem",
      },
      name: {
        fontSize: baseFontSize * 2,
        fontWeight: "bold",
        color: accentColor,
        marginBottom: "0.25rem",
      },
      profession: {
        fontSize: baseFontSize * 0.9,
        color: "#4b5563",
      },
      contactRow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.25rem",
        fontSize: baseFontSize * 0.8,
      },
      contactItem: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
      },
    };
  };

  // ----- Render a section given its key and column side -----
  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;

    // Map key to typography key (skills are combined under "skills")
    const typographyKey =
      key === "technical_skills" || key === "soft_skills" ? "skills" : (key === "about" ? "professional_summary" : key);
    const s = styles(typographyKey);

    // Helper to wrap with SortableItem
    const withSortable = (content) => (
      <SortableItem
        key={key}
        index={index}
        total={list.length}
        onMoveUp={() => move(list, setList, index, "up")}
        onMoveDown={() => move(list, setList, index, "down")}
      >
        {content}
      </SortableItem>
    );

    // ----- Section renderers -----
    switch (key) {
      case "about":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>ABOUT ME</h2>
            <p style={s.textSm}>{data.professional_summary}</p>
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>TECHNICAL SKILLS</h2>
            {data.skills.technicalSkills.map((skill, i) => (
              <div key={i} style={s.borderL}>
                <span style={s.textSm}>{skill}</span>
              </div>
            ))}
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>SOFT SKILLS</h2>
            {data.skills.softSkills.map((skill, i) => (
              <div key={i} style={s.borderL}>
                <span style={s.textSm}>{skill}</span>
              </div>
            ))}
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>LANGUAGES</h2>
            {data.languages.map((lang, i) => (
              <div key={i} style={s.borderL}>
                <span style={s.textSm}>
                  {lang.language} {lang.proficiency && `(${lang.proficiency})`}
                </span>
              </div>
            ))}
          </section>
        );

      case "certifications":
        // Use custom_sections[0] as certifications if available, else fallback
        const certs = data.custom_sections?.[0]?.items || [];
        if (!hasItems(certs)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>CERTIFICATIONS</h2>
            {certs.map((cert, i) => (
              <div key={i} style={s.borderL}>
                <span style={s.textSm}>{cert.title}</span>
                {cert.description && (
                  <p style={s.textXs}>{cert.description}</p>
                )}
              </div>
            ))}
          </section>
        );

      case "awards":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>AWARDS</h2>
            {data.achievements.map((award, i) => (
              <div key={i} style={s.borderL}>
                <strong style={s.textSm}>{award.title}</strong>
                {award.year && <div style={s.textXs}>{award.year}</div>}
                {award.description && (
                  <p style={s.textXs}>{award.description}</p>
                )}
              </div>
            ))}
          </section>
        );

      // ----- Right column sections -----
      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.borderL}>
                <div style={s.between}>
                  <strong>{exp.position}</strong>
                  <span style={s.textXs}>
                    {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}
                  </span>
                </div>
                <div style={s.textSm}>{exp.company}</div>
                {exp.description && <p style={s.textXs}>{exp.description}</p>}
              </div>
            ))}
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>EDUCATION</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={s.borderL}>
                <strong>
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </strong>
                <div style={s.textXs}>{edu.institution}</div>
                {edu.gpa && <div style={s.textXs}>GPA: {edu.gpa}</div>}
                {edu.graduation_date && (
                  <div style={s.textXs}>{edu.graduation_date}</div>
                )}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>PROJECTS</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={s.borderL}>
                <strong>{proj.name}</strong>
                {proj.type && <div style={s.textXs}>{proj.type}</div>}
                {proj.description && <p style={s.textSm}>{proj.description}</p>}
              </div>
            ))}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>PARTICIPATIONS</h2>
            {data.participations.map((part, i) => (
              <div key={i} style={s.borderL}>
                <strong>{part.title}</strong>
                {part.organization && (
                  <div style={s.textSm}>{part.organization}</div>
                )}
                {part.description && <p style={s.textXs}>{part.description}</p>}
              </div>
            ))}
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>ACHIEVEMENTS</h2>
            {data.achievements.map((ach, i) => (
              <div key={i} style={s.borderL}>
                <strong>{ach.title}</strong>
                {ach.description && <p style={s.textXs}>{ach.description}</p>}
              </div>
            ))}
          </section>
        );

      default:
        if (key.startsWith("custom_")) {
          const idx = Number(key.split("_")[1]);
          const cs = data.custom_sections?.[idx];
          if (!cs || !hasItems(cs.items)) return null;

          return withSortable(
            <section style={s.section}>
              <h2 style={s.h2}>{cs.section_title}</h2>
              {cs.items.map((item, i) => (
                <div key={i} style={s.borderL}>
                  <strong>{item.title}</strong>
                  {item.description && <p style={s.textSm}>{item.description}</p>}
                </div>
              ))}
            </section>
          );
        }
        return null;
    }
  };

  const h = styles("header");

  return (
    <div style={h.page}>
      {/* Header */}
      <header style={h.header}>
        <div>
          <div style={h.name}>{data.personal_info?.full_name}</div>
          {data.personal_info?.profession && (
            <div style={h.profession}>{data.personal_info.profession}</div>
          )}
        </div>
        <div style={h.contactRow}>
          {data.personal_info?.phone && (
            <span style={h.contactItem}>
              <Phone size={12} /> {data.personal_info.phone}
            </span>
          )}
          {data.personal_info?.email && (
            <span style={h.contactItem}>
              <Mail size={12} /> {data.personal_info.email}
            </span>
          )}
          {data.personal_info?.linkedin && (
            <span style={h.contactItem}>
              <Linkedin size={12} /> {data.personal_info.linkedin}
            </span>
          )}
          {data.personal_info?.location && (
            <span style={h.contactItem}>
              <MapPin size={12} /> {data.personal_info.location}
            </span>
          )}
          {data.personal_info?.website && (
            <span style={h.contactItem}>
              <Globe size={12} /> {data.personal_info.website}
            </span>
          )}
        </div>
      </header>

      {/* Two‑column content */}
      <div style={h.columns}>
        <aside style={h.left}>
          {leftSections.map((key, i) => renderSection(key, i, "left"))}
        </aside>
        <main style={h.right}>
          {rightSections.map((key, i) => renderSection(key, i, "right"))}
        </main>
      </div>
    </div>
  );
};

export default React.memo(ArchitectTemplate);