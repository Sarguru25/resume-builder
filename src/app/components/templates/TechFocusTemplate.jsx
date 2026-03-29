import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

const SortableItem = ({ index, total, onMoveUp, onMoveDown, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
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
          zIndex: 10
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
const btnStyle = { border: "none", background: "#e5e7eb", borderRadius: "4px", fontSize: "10px", cursor: "pointer", padding: "2px 4px", lineHeight: 1 };

const TechFocusTemplate = ({ data, accentColor = "#4338CA", sectionTypographies = {}, leftSectionOrder, rightSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultLeft = useMemo(() => ["technical_skills", "soft_skills", "languages", "education"], []);
  const defaultRight = useMemo(() => ["about", "experience", "projects", "achievements", "participations", "certifications"], []);

  const customKeys = useMemo(() => data?.custom_sections?.map((_, i) => `custom_${i}`) || [], [data?.custom_sections]);
  const [leftSections, setLeftSections] = useState(leftSectionOrder || defaultLeft);
  const [rightSections, setRightSections] = useState(rightSectionOrder || [...defaultRight, ...customKeys]);

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = { header: { fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.6 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "2.5rem", background: "#F8FAFC", color: "#1E293B", fontFamily: t.fontFamily, borderTop: `8px solid ${accentColor}` },
      columns: { display: "flex", gap: "2rem", marginTop: "2rem" },
      leftCol: { width: "30%", display: "flex", flexDirection: "column", gap: "1.5rem" },
      rightCol: { width: "70%", display: "flex", flexDirection: "column", gap: "1.5rem" },
      section: { marginBottom: "1rem" },
      h2: { fontSize: baseFontSize * 1.1, fontWeight: "bold", color: accentColor, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", textTransform: "uppercase" },
      slash: { color: "#94A3B8" },
      textSm: { fontSize: baseFontSize * 0.9, color: "#334155" },
      textXs: { fontSize: baseFontSize * 0.8, color: "#64748B" },
      header: { borderBottom: "1px solid #CBD5E1", paddingBottom: "1.5rem" },
      name: { fontSize: baseFontSize * 2.2, fontWeight: "900", color: "#0F172A", letterSpacing: "-1px" },
      profession: { fontSize: baseFontSize * 1.1, color: accentColor, fontWeight: "600", marginTop: "0.5rem" },
      contactRow: { display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem", fontSize: baseFontSize * 0.85, fontWeight: "500" },
      contactItem: { display: "flex", alignItems: "center", gap: "0.35rem" },
      item: { marginBottom: "1rem" },
      subtitle: { fontSize: baseFontSize * 0.95, color: accentColor, fontWeight: 500, fontStyle: "italic", marginBottom: "0.25rem" },
      skillsList: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
      skillPill: { padding: "0.25rem 0.5rem", backgroundColor: "#f1f5f9", color: "#0f172a", borderRadius: "4px", fontSize: baseFontSize * 0.85, fontWeight: 500, border: "1px solid #e2e8f0" },
      barBg: { height: "6px", background: "#CBD5E1", borderRadius: "3px", width: "100%", marginTop: "4px", overflow: "hidden" },
      barFg: { height: "100%", background: accentColor, borderRadius: "3px" }
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const typographyKey = key === "technical_skills" || key === "soft_skills" ? "skills" : (key === "about" ? "professional_summary" : key);
    const s = styles(typographyKey);
    const withSortable = (content) => <SortableItem key={key} index={index} total={list.length} onMoveUp={() => move(list, setList, index, "up")} onMoveDown={() => move(list, setList, index, "down")}>{content}</SortableItem>;

    switch (key) {
      case "about":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> PROFILE</h2>
            <p style={s.textSm}>{data.professional_summary}</p>
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> TECH SKILLS</h2>
            <div style={s.skillsList}>
              {data.skills.technicalSkills.map((skill, i) => <span key={i} style={s.skillPill}>{skill}</span>)}
            </div>
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> SOFT SKILLS</h2>
            <div style={s.skillsList}>
              {data.skills.softSkills.map((skill, i) => <span key={i} style={s.skillPill}>{skill}</span>)}
            </div>
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> LANGUAGES</h2>
            <div style={s.skillsList}>
              {data.languages.map((lang, i) => <span key={i} style={s.skillPill}>{lang.language} {lang.proficiency && `(${lang.proficiency})`}</span>)}
            </div>
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong style={{ fontSize: s.textSm.fontSize, fontWeight: 600 }}>{exp.position}</strong>
                  <span style={s.textXs}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
                </div>
                <div style={s.subtitle}>{exp.company}</div>
                {exp.description && <p style={s.textSm}>{exp.description}</p>}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> PROJECTS</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={s.item}>
                <strong>{proj.name}</strong>
                {proj.description && <p style={{ ...s.textSm, marginTop: "4px" }}>{proj.description}</p>}
              </div>
            ))}
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> EDUCATION</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={s.item}>
                <div style={{ fontWeight: "600", fontSize: s.textSm.fontSize }}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                <div style={s.subtitle}>{edu.institution}</div>
                {edu.graduation_date && <div style={s.textXs}>{edu.graduation_date}</div>}
                {edu.gpa && <div style={s.textSm}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> ACHIEVEMENTS</h2>
            {data.achievements.map((ach, i) => (
              <div key={i} style={s.item}>
                <div style={{ fontWeight: 600 }}>{ach.title}</div>
                {ach.description && <p style={s.textSm}>{ach.description}</p>}
              </div>
            ))}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.slash}>//</span> PARTICIPATIONS</h2>
            {data.participations.map((part, i) => (
              <div key={i} style={s.item}>
                <div style={{ fontWeight: 600 }}>{part.title}</div>
                {part.organization && <div style={s.subtitle}>{part.organization}</div>}
                {part.description && <p style={s.textSm}>{part.description}</p>}
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
                <div key={i} style={s.item}>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
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
      <header style={h.header}>
        <div style={h.name}>{data.personal_info?.full_name}</div>
        {data.personal_info?.profession && <div style={h.profession}>{data.personal_info.profession}</div>}
        <div style={h.contactRow}>
          {data.personal_info?.phone && <span style={h.contactItem}><Phone size={14} /> {data.personal_info.phone}</span>}
          {data.personal_info?.email && <span style={h.contactItem}><Mail size={14} /> {data.personal_info.email}</span>}
          {data.personal_info?.location && <span style={h.contactItem}><MapPin size={14} /> {data.personal_info.location}</span>}
          {data.personal_info?.linkedin && <span style={h.contactItem}><Linkedin size={14} /> {data.personal_info.linkedin}</span>}
          {data.personal_info?.website && <span style={h.contactItem}><Globe size={14} /> {data.personal_info.website}</span>}
        </div>
      </header>
      <div style={h.columns}>
        <aside style={h.leftCol}>{leftSections.map((key, i) => renderSection(key, i, "left"))}</aside>
        <main style={h.rightCol}>{rightSections.map((key, i) => renderSection(key, i, "right"))}</main>
      </div>
    </div>
  );
};

export default React.memo(TechFocusTemplate);