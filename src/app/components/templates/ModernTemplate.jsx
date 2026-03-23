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
   Sortable Wrapper
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
          left: "-32px",
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
   Modern Resume Template (Enhanced)
========================= */
const ModernTemplate = ({
  data,
  accentColor = "#3B82F6",
  sectionTypographies = {},
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  /* ---------- Section Order ---------- */
  const initialSections = useMemo(() => {
    const base = [
      "professional_summary",
      "experience",
      "projects",
      "education",
      "technical_skills",
      "soft_skills",
      "participations",
      "achievements",
      "languages",
    ];

    const custom = data?.custom_sections?.map((_, i) => `custom_${i}`) || [];
    return [...base, ...custom];
  }, [data?.custom_sections]);

  const [sections, setSections] = useState(initialSections);

  const moveSection = (index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= sections.length) return;
    const copy = [...sections];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setSections(copy);
  };

  const baseTypography = {
    header: { fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.5 },
  };

  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    // Merge section‑specific settings with header defaults
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;

    return {
      root: {
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "2rem",
        background: "#fff",
        color: "#1f2937",
        fontFamily: t.fontFamily,
      },
      section: {
        marginBottom: "1.5rem", // slightly increased spacing
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
      // Left border style (accent line)
      borderL: {
        borderLeft: `2px solid ${accentColor}`,
        paddingLeft: "0.75rem",
        marginBottom: "0.6rem",
        paddingTop: "0.1rem",
        paddingBottom: "0.1rem",
      },
      between: { display: "flex", justifyContent: "space-between" },
      header: {
        textAlign: "center",
        borderBottom: "1px solid #e5e7eb",
        paddingBottom: "1rem",
        marginBottom: "1.5rem",
      },
      name: {
        fontSize: baseFontSize * 1.8,
        fontWeight: "bold",
        color: accentColor,
        marginBottom: "0.5rem",
      },
      headerRow: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "1rem",
        fontSize: baseFontSize * 0.8,
        alignItems: "center",
      },
      contactItem: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
      },
    };
  };

  const renderSection = (key, index) => {
    // Map internal keys to typography keys
    const typographyKey =
      key === "technical_skills" || key === "soft_skills" ? "skills" : key;
    const s = styles(typographyKey);

    switch (key) {
      case "professional_summary":
        if (!data.professional_summary) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>PROFESSIONAL SUMMARY</h2>
              <p style={s.textSm}>{data.professional_summary}</p>
            </section>
          </SortableItem>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>EXPERIENCE</h2>
              {data.experience.map((e, i) => (
                <div key={i} style={s.borderL}>
                  <div style={s.between}>
                    <strong>{e.position}</strong>
                    <span style={s.textXs}>
                      {e.start_date} – {e.is_current ? "Present" : e.end_date}
                    </span>
                  </div>
                  <div style={s.textSm}>{e.company}</div>
                  {e.description && <p style={s.textXs}>{e.description}</p>}
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>PROJECTS</h2>
              {data.projects.map((p, i) => (
                <div key={i} style={s.borderL}>
                  <strong>{p.name}</strong>
                  {p.type && <div style={s.textXs}>{p.type}</div>}
                  {p.description && <p style={s.textSm}>{p.description}</p>}
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>EDUCATION</h2>
              {data.education.map((e, i) => (
                <div key={i} style={s.borderL}>
                  <strong>
                    {e.degree}
                    {e.field && ` in ${e.field}`}
                  </strong>
                  <div style={s.textXs}>{e.institution}</div>
                  {e.gpa && <div style={s.textXs}>GPA: {e.gpa}</div>}
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>TECHNICAL SKILLS</h2>
              {/* Each skill now gets a left border line (matching other sections) */}
              {data.skills.technicalSkills.map((skill, i) => (
                <div key={i} style={s.borderL}>
                  <span style={s.textSm}>{skill}</span>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>SOFT SKILLS</h2>
              {data.skills.softSkills.map((skill, i) => (
                <div key={i} style={s.borderL}>
                  <span style={s.textSm}>{skill}</span>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>LANGUAGES</h2>
              {data.languages.map((l, i) => (
                <div key={i} style={s.borderL}>
                  <span style={s.textSm}>
                    {l.language} {l.proficiency && `(${l.proficiency})`}
                  </span>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>PARTICIPATIONS</h2>
              {data.participations.map((p, i) => (
                <div key={i} style={s.borderL}>
                  <strong>{p.title}</strong>
                  <div style={s.textSm}>{p.organization}</div>
                  <p style={s.textXs}>{p.description}</p>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return (
          <SortableItem
            key={key}
            index={index}
            total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>ACHIEVEMENTS</h2>
              {data.achievements.map((a, i) => (
                <div key={i} style={s.borderL}>
                  <strong>{a.title}</strong>
                  <p style={s.textXs}>{a.description}</p>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      default:
        if (key.startsWith("custom_")) {
          const i = Number(key.split("_")[1]);
          const cs = data.custom_sections?.[i];
          if (!cs || !hasItems(cs.items)) return null;

          return (
            <SortableItem
              key={key}
              index={index}
              total={sections.length}
              onMoveUp={() => moveSection(index, "up")}
              onMoveDown={() => moveSection(index, "down")}
            >
              <section style={s.section}>
                <h2 style={s.h2}>{cs.section_title}</h2>
                {cs.items.map((it, idx) => (
                  <div key={idx} style={s.borderL}>
                    <strong>{it.title}</strong>
                    <p style={s.textSm}>{it.description}</p>
                  </div>
                ))}
              </section>
            </SortableItem>
          );
        }
        return null;
    }
  };

  const h = styles("header");

  return (
    <div style={h.root}>
      <header style={h.header}>
        <div style={h.name}>{data.personal_info?.full_name}</div>
        <div style={h.headerRow}>
          {data.personal_info?.email && (
            <span style={h.contactItem}>
              <Mail size={14} /> {data.personal_info.email}
            </span>
          )}
          {data.personal_info?.phone && (
            <span style={h.contactItem}>
              <Phone size={14} /> {data.personal_info.phone}
            </span>
          )}
          {data.personal_info?.location && (
            <span style={h.contactItem}>
              <MapPin size={14} /> {data.personal_info.location}
            </span>
          )}
          {data.personal_info?.linkedin && (
            <span style={h.contactItem}>
              <Linkedin size={14} /> {data.personal_info.linkedin}
            </span>
          )}
          {data.personal_info?.website && (
            <span style={h.contactItem}>
              <Globe size={14} /> {data.personal_info.website}
            </span>
          )}
        </div>
      </header>

      {sections.map(renderSection)}
    </div>
  );
};

export default React.memo(ModernTemplate);