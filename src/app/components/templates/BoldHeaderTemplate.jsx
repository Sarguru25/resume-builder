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
   Sortable Item
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
        {index > 0 && (
          <button onClick={onMoveUp} style={btnStyle}>
            ↑
          </button>
        )}
        {index < total - 1 && (
          <button onClick={onMoveDown} style={btnStyle}>
            ↓
          </button>
        )}
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
   Template
========================= */
const BoldHeaderTemplate = ({
  data,
  accentColor = "#047857",
  sectionTypographies = {},
  leftSectionOrder,
  rightSectionOrder,
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultLeft = useMemo(
    () => [
      "about",
      "technical_skills",
      "soft_skills",
      "languages",
      "certifications",
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
    ],
    []
  );

  const customKeys = useMemo(
    () => data?.custom_sections?.map((_, i) => `custom_${i}`) || [],
    [data?.custom_sections]
  );

  const [leftSections, setLeftSections] = useState(
    leftSectionOrder || defaultLeft
  );
  const [rightSections, setRightSections] = useState(
    rightSectionOrder || [...defaultRight, ...customKeys]
  );

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = {
    header: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: 13,
      lineHeight: 1.6,
    },
  };

  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;

    return {
      page: {
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        background: "#fff",
        color: "#111827",
        fontFamily: t.fontFamily,
        textAlign: "justify",
      },
      header: {
        background: accentColor,
        color: "#fff",
        padding: "3rem 2rem",
        textAlign: "center",
      },
      name: {
        fontSize: baseFontSize * 3,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "2px",
      },
      profession: {
        fontSize: baseFontSize * 1.3,
        fontWeight: "600",
        textTransform: "uppercase",
      },
      contactRow: {
        display: "flex",
        justifyContent: "center",
        gap: "1.5rem",
        marginTop: "1.5rem",
        flexWrap: "wrap",
      },
      contactItem: { display: "flex", alignItems: "center", gap: "4px" },
      mainContent: {
        padding: "2.5rem 2rem",
        display: "flex",
        gap: "2rem",
      },
      leftCol: { width: "35%" },
      rightCol: { width: "65%" },
      section: { marginBottom: "1.5rem" },
      h2: {
        fontSize: baseFontSize * 1.2,
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: "1rem",
        color: accentColor,
        borderBottom: `2px solid ${accentColor}`,
        display: "inline-block",
      },
      textSm: { fontSize: baseFontSize * 0.95 },
      textXs: { fontSize: baseFontSize * 0.85, color: "#6B7280" },
      item: { marginBottom: "1rem" },
      between: { display: "flex", justifyContent: "space-between" },
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const s = styles(key);

    const wrap = (content) => (
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

    switch (key) {
      case "about":
        if (!data.professional_summary) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>ABOUT ME</h2>
            <p style={s.textSm}>{data.professional_summary}</p>
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>TECHNICAL SKILLS</h2>
            <ul>{data.skills.technicalSkills.map((sk, i) => <li key={i}>{sk}</li>)}</ul>
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>SOFT SKILLS</h2>
            <ul>{data.skills.softSkills.map((sk, i) => <li key={i}>{sk}</li>)}</ul>
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>LANGUAGES</h2>
            {data.languages.map((l, i) => (
              <div key={i}>
                {l.language} ({l.proficiency})
              </div>
            ))}
          </section>
        );

      case "certifications":
        const certs = data.custom_sections?.[0]?.items || [];
        if (!hasItems(certs)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>CERTIFICATIONS</h2>
            {certs.map((c, i) => (
              <div key={i}>
                <strong>{c.title}</strong>
                {c.description && <p>{c.description}</p>}
              </div>
            ))}
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <strong>{exp.position}</strong>
                <div style={s.between}>
                  <span>{exp.company}</span>
                  <span>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
                </div>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>EDUCATION</h2>
            {data.education.map((edu, i) => (
              <div key={i}>
                <strong>{edu.degree}</strong>
                <div>{edu.institution}</div>
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>PROJECTS</h2>
            {data.projects.map((p, i) => (
              <div key={i}>
                <strong>{p.name}</strong>
                <p>{p.description}</p>
              </div>
            ))}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>PARTICIPATIONS</h2>
            {data.participations.map((p, i) => (
              <div key={i}>
                <strong>{p.title}</strong>
                {p.organization && <div>{p.organization}</div>}
              </div>
            ))}
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>ACHIEVEMENTS</h2>
            {data.achievements.map((a, i) => (
              <div key={i}>
                <strong>{a.title}</strong>
                {a.description && <p>{a.description}</p>}
              </div>
            ))}
          </section>
        );

      default:
        if (key.startsWith("custom_")) {
          const idx = Number(key.split("_")[1]);
          const cs = data.custom_sections?.[idx];
          if (!cs || !hasItems(cs.items)) return null;

          return wrap(
            <section style={s.section}>
              <h2 style={s.h2}>{cs.section_title}</h2>
              {cs.items.map((it, i) => (
                <div key={i}>
                  <strong>{it.title}</strong>
                  {it.description && <p>{it.description}</p>}
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
      <header style={h.header}>
        <div style={h.name}>{data.personal_info?.full_name}</div>
        {data.personal_info?.profession && (
          <div style={h.profession}>{data.personal_info.profession}</div>
        )}

        <div style={h.contactRow}>
          {data.personal_info?.phone && <span style={h.contactItem}><Phone size={14}/> {data.personal_info.phone}</span>}
          {data.personal_info?.email && <span style={h.contactItem}><Mail size={14}/> {data.personal_info.email}</span>}
          {data.personal_info?.location && <span style={h.contactItem}><MapPin size={14}/> {data.personal_info.location}</span>}
          {data.personal_info?.linkedin && <span style={h.contactItem}><Linkedin size={14}/> {data.personal_info.linkedin}</span>}
          {data.personal_info?.website && <span style={h.contactItem}><Globe size={14}/> {data.personal_info.website}</span>}
        </div>
      </header>

      <div style={h.mainContent}>
        <aside style={h.leftCol}>
          {leftSections.map((key, i) => renderSection(key, i, "left"))}
        </aside>
        <main style={h.rightCol}>
          {rightSections.map((key, i) => renderSection(key, i, "right"))}
        </main>
      </div>
    </div>
  );
};

export default React.memo(BoldHeaderTemplate);