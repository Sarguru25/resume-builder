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
};

/* =========================
   Modern Resume Template
========================= */
const ModernTemplate = ({
  data,
  accentColor = "#3B82F6",
  sectionTypographies = {},
}) => {
  /* ---------- Section Order ---------- */
  const initialSections = useMemo(() => {
    const base = [
      "professional_summary",
      "experience",
      "projects",
      "education",
      "skills",
      "participations",
      "achievements",
      "languages",
    ];
    const custom =
      data?.custom_sections?.map((_, i) => `custom_${i}`) || [];
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

  /* ---------- Typography ---------- */
  const baseTypography = {
    header: { fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.5 },
  };

  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = merged[key] || merged.header;
    const b = t.fontSize;

    return {
      root: {
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        padding: "2rem",
        background: "#fff",
        color: "#1f2937",
        fontFamily: t.fontFamily,
      },
      section: { marginBottom: "1rem", fontSize: b, lineHeight: t.lineHeight },
      h2: {
        fontSize: b * 1.25,
        fontWeight: 600,
        color: accentColor,
        marginBottom: "0.5rem",
      },
      textSm: { fontSize: b * 0.875 },
      textXs: { fontSize: b * 0.75, color: "#6b7280" },
      borderL: {
        borderLeft: `2px solid ${accentColor}`,
        paddingLeft: "0.5rem",
        marginBottom: "0.6rem",
      },
      between: { display: "flex", justifyContent: "space-between" },
      tag: {
        background: "#f3f4f6",
        borderRadius: "4px",
        padding: "2px 6px",
        fontSize: b * 0.75,
      },
      header: {
        textAlign: "center",
        borderBottom: "1px solid #e5e7eb",
        paddingBottom: "0.5rem",
        marginBottom: "1rem",
      },
      name: {
        fontSize: b * 1.6,
        fontWeight: "bold",
        color: accentColor,
      },
      headerRow: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
        fontSize: b * 0.8,
      },
    };
  };

  /* ---------- Render Section ---------- */
  const renderSection = (key, index) => {
    const s = styles(key);

    switch (key) {
      case "professional_summary":
        return data.professional_summary && (
          <SortableItem key={key} index={index} total={sections.length}
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
        return data.experience?.length && (
          <SortableItem key={key} index={index} total={sections.length}
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
        return data.projects?.length && (
          <SortableItem key={key} index={index} total={sections.length}
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
        return data.education?.length && (
          <SortableItem key={key} index={index} total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>EDUCATION</h2>
              {data.education.map((e, i) => (
                <div key={i} style={s.borderL}>
                  <strong>{e.degree}{e.field && ` in ${e.field}`}</strong>
                  <div style={s.textXs}>{e.institution}</div>
                  {e.gpa && <div style={s.textXs}>GPA: {e.gpa}</div>}
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "skills":
        return data.skills && (
          <SortableItem key={key} index={index} total={sections.length}
            onMoveUp={() => moveSection(index, "up")}
            onMoveDown={() => moveSection(index, "down")}
          >
            <section style={s.section}>
              <h2 style={s.h2}>SKILLS</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[...(data.skills.technicalSkills || []), ...(data.skills.softSkills || [])]
                  .map((sk, i) => <span key={i} style={s.tag}>{sk}</span>)}
              </div>
            </section>
          </SortableItem>
        );

      case "languages":
        return data.languages?.length && (
          <SortableItem key={key} index={index} total={sections.length}>
            <section style={s.section}>
              <h2 style={s.h2}>LANGUAGES</h2>
              {data.languages.map((l, i) => (
                <div key={i} style={s.textSm}>
                  {l.language} {l.proficiency && `(${l.proficiency})`}
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "participations":
        return data.participations?.length && (
          <SortableItem key={key} index={index} total={sections.length}>
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
        return data.achievements?.length && (
          <SortableItem key={key} index={index} total={sections.length}>
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
          if (!cs) return null;

          return (
            <SortableItem key={key} index={index} total={sections.length}>
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
          {data.personal_info?.email && <><Mail size={14}/> {data.personal_info.email}</>}
          {data.personal_info?.phone && <><Phone size={14}/> {data.personal_info.phone}</>}
          {data.personal_info?.location && <><MapPin size={14}/> {data.personal_info.location}</>}
          {data.personal_info?.linkedin && <><Linkedin size={14}/> {data.personal_info.linkedin}</>}
          {data.personal_info?.website && <><Globe size={14}/> {data.personal_info.website}</>}
        </div>
      </header>

      {sections.map(renderSection)}
    </div>
  );
};

export default React.memo(ModernTemplate);
