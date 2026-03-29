import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, GripVertical } from "lucide-react";

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

const CreativeFlowTemplate = ({
  data,
  accentColor = "#14B8A6",
  sectionTypographies = {},
  leftSectionOrder,
  rightSectionOrder,
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultLeft = useMemo(() => ["about", "technical_skills", "soft_skills", "languages", "education"], []);
  const defaultRight = useMemo(
    () => ["experience", "projects", "certifications", "achievements", "participations"],
    []
  );

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

  const baseTypography = { header: { fontFamily: "'Poppins', sans-serif", fontSize: 13, lineHeight: 1.6 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "0", background: "#fff", color: "#333", fontFamily: t.fontFamily },
      header: { padding: "3rem 2rem 2rem 2rem", background: `linear-gradient(135deg, ${accentColor} 0%, #0F766E 100%)`, color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" },
      headerShape: { position: "absolute", right: "-50px", top: "-50px", width: "150px", height: "150px", background: "#F43F5E", borderRadius: "50%", opacity: 0.8 },
      name: { fontSize: baseFontSize * 2.5, fontWeight: "800", position: "relative", zIndex: 1, letterSpacing: "1px" },
      profession: { fontSize: baseFontSize * 1.2, fontWeight: "500", opacity: 0.9, position: "relative", zIndex: 1, marginTop: "0.25rem", letterSpacing: "2px", textTransform: "uppercase" },
      contactRow: { display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap", fontSize: baseFontSize * 0.85, position: "relative", zIndex: 1 },
      contactItem: { display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px" },
      columns: { display: "flex", padding: "2rem", gap: "2rem" },
      leftCol: { width: "35%", display: "flex", flexDirection: "column", gap: "1.5rem" },
      rightCol: { width: "65%", display: "flex", flexDirection: "column", gap: "1.5rem" },
      section: { marginBottom: "0.5rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2: { fontSize: baseFontSize * 1.15, fontWeight: "700", color: accentColor, marginBottom: "1rem", display: "inline-block", background: "#F1F5F9", padding: "4px 12px", borderRadius: "6px" },
      textSm: { fontSize: baseFontSize * 0.9 },
      textXs: { fontSize: baseFontSize * 0.8, color: "#64748B" },
      between: { display: "flex", justifyContent: "space-between", alignItems: "baseline" },
      item: { marginBottom: "1.25rem" },
      skillBarContainer: { width: "100%", height: "8px", background: "#E2E8F0", borderRadius: "4px", marginTop: "6px", overflow: "hidden" },
      skillBarFill: { height: "100%", background: "#F43F5E", borderRadius: "4px" },
      listLi: { marginBottom: "0.25rem", color: "#334155" },
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const typographyKey = key === "technical_skills" || key === "soft_skills" ? "skills" : key;
    const s = styles(typographyKey);
    const withSortable = (content) => (
      <SortableItem key={key} index={index} total={list.length} onMoveUp={() => move(list, setList, index, "up")} onMoveDown={() => move(list, setList, index, "down")}>
        {content}
      </SortableItem>
    );

    switch (key) {
      case "about":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Profile</h2>
            <p style={s.textSm}>{data.professional_summary}</p>
          </section>
        );
      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Hard Skills</h2>
            {data.skills.technicalSkills.map((sk, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div style={{ fontSize: s.textSm.fontSize, fontWeight: "500" }}>{sk}</div>
                <div style={s.skillBarContainer}>
                  <div style={{ ...s.skillBarFill, width: `${Math.floor(Math.random() * 40 + 60)}%` }}></div>
                </div>
              </div>
            ))}
          </section>
        );
      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Soft Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {data.skills.softSkills.map((sk) => (
                <span key={sk} style={{ background: accentColor, color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: s.textSm.fontSize }}>
                  {sk}
                </span>
              ))}
            </div>
          </section>
        );
      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Languages</h2>
            <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: s.textSm.fontSize }}>
              {data.languages.map((lang, i) => (
                <li key={i} style={s.listLi}>{typeof lang === "string" ? lang : `${lang.name} (${lang.level})`}</li>
              ))}
            </ul>
          </section>
        );
      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={{ fontWeight: "700", fontSize: "1.1em" }}>{exp.position}</div>
                <div style={{ color: accentColor, fontWeight: "600", fontSize: s.textSm.fontSize, marginBottom: "4px" }}>
                  {exp.company} | {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}
                </div>
                <p style={s.textSm}>{exp.description}</p>
              </div>
            ))}
          </section>
        );
      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={s.item}>
                <div style={{ fontWeight: "600", fontSize: s.textSm.fontSize }}>{edu.degree}</div>
                <div style={s.textXs}>{edu.institution}</div>
                <div style={s.textXs}>{edu.graduation_date}</div>
              </div>
            ))}
          </section>
        );
      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Featured Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={{ ...s.item, borderLeft: `3px solid #F43F5E`, paddingLeft: "10px" }}>
                <strong>{proj.name}</strong> {proj.type && <span style={s.textXs}>| {proj.type}</span>}
                <p style={s.textSm}>{proj.description}</p>
              </div>
            ))}
          </section>
        );
      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Achievements</h2>
            <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: s.textSm.fontSize }}>
              {data.achievements.map((a, i) => (
                <li key={i} style={s.listLi}>
                  {typeof a === "string" ? a : <><strong>{a.title}</strong> ({a.year}) {a.description}</>}
                </li>
              ))}
            </ul>
          </section>
        );
      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Participations</h2>
            <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: s.textSm.fontSize }}>
              {data.participations.map((p, i) => (
                <li key={i} style={s.listLi}>
                  {typeof p === "string" ? p : <><strong>{p.title}</strong> ({p.year}) {p.description}</>}
                </li>
              ))}
            </ul>
          </section>
        );
      default:
        if (key.startsWith("custom_")) {
          const idx = parseInt(key.split("_")[1]);
          const custom = data.custom_sections?.[idx];
          if (!custom) return null;
          return withSortable(
            <section style={s.section}>
              <h2 style={s.h2}>{custom.title || `Custom ${idx + 1}`}</h2>
              <p style={s.textSm}>{custom.content}</p>
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
        <div style={h.headerShape}></div>
        <div style={h.name}>{data.personal_info?.full_name}</div>
        {data.personal_info?.profession && <div style={h.profession}>{data.personal_info.profession}</div>}
        <div style={h.contactRow}>
          {data.personal_info?.phone && <span style={h.contactItem}><Phone size={14} /> {data.personal_info.phone}</span>}
          {data.personal_info?.email && <span style={h.contactItem}><Mail size={14} /> {data.personal_info.email}</span>}
          {data.personal_info?.location && <span style={h.contactItem}><MapPin size={14} /> {data.personal_info.location}</span>}
          {data.personal_info?.linkedin && <span style={h.contactItem}><Linkedin size={14} /> {data.personal_info.linkedin}</span>}
        </div>
      </header>
      <div style={h.columns}>
        <aside style={h.leftCol}>{leftSections.map((key, i) => renderSection(key, i, "left"))}</aside>
        <main style={h.rightCol}>{rightSections.map((key, i) => renderSection(key, i, "right"))}</main>
      </div>
    </div>
  );
};

export default React.memo(CreativeFlowTemplate);