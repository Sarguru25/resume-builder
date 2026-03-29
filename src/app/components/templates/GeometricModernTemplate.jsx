import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

// Sortable item wrapper for sections
const SortableItem = ({ index, total, onMoveUp, onMoveDown, children }) => {
  const [hover, setHover] = useState(false);

  const btnStyle = {
    border: "none",
    background: "#e5e7eb",
    borderRadius: "4px",
    fontSize: "10px",
    cursor: "pointer",
    padding: "2px 4px",
    lineHeight: 1,
  };

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

// Main template
const GeometricModernTemplate = ({
  data,
  accentColor = "#0284C7",
  sectionTypographies = {},
  leftSectionOrder,
  rightSectionOrder,
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  // Default section orders
  const defaultLeft = useMemo(
    () => ["contact", "technical_skills", "soft_skills", "languages"],
    []
  );
  const defaultRight = useMemo(
    () => ["about", "experience", "education", "projects", "achievements"],
    []
  );

  const customKeys = useMemo(
    () => data?.custom_sections?.map((_, i) => `custom_${i}`) || [],
    [data?.custom_sections]
  );

  const [leftSections, setLeftSections] = useState(leftSectionOrder || defaultLeft);
  const [rightSections, setRightSections] = useState(rightSectionOrder || [...defaultRight, ...customKeys]);

  // Swap function for sortable sections
  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  // Typography styles
  const baseTypography = { header: { fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.5 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  // Generates styles for each section and layout
  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: {
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "0",
        background: "#fff",
        color: "#1E293B",
        fontFamily: t.fontFamily,
        position: "relative",
        zIndex: 0,
      },
      topGeometry: {
        position: "absolute",
        top: 0,
        right: 0,
        width: "300px",
        height: "150px",
        background: accentColor,
        opacity: 0.1,
        clipPath: "polygon(100% 0, 0 0, 100% 100%)",
        zIndex: -1,
      },
      bottomGeometry: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "300px",
        height: "150px",
        background: accentColor,
        opacity: 0.1,
        clipPath: "polygon(0 100%, 0 0, 100% 100%)",
        zIndex: -1,
      },
      columns: { display: "flex", minHeight: "297mm" },
      leftCol: { width: "32%", padding: "3rem 2rem", position: "relative", background: "rgba(248, 250, 252, 0.8)" },
      rightCol: { width: "68%", padding: "3rem 2.5rem" },
      name: { fontSize: baseFontSize * 2.8, fontWeight: "900", textTransform: "uppercase", letterSpacing: "-1px", lineHeight: 1, marginBottom: "0.5rem", color: "#0F172A" },
      profession: { fontSize: baseFontSize * 1.3, fontWeight: "600", color: accentColor, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2.5rem" },
      sectionLeft: { marginBottom: "2rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      sectionRight: { marginBottom: "2rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2Left: { fontSize: baseFontSize * 1.1, fontWeight: "800", textTransform: "uppercase", marginBottom: "1rem", color: "#0F172A", display: "inline-block", position: "relative" },
      h2LeftDecor: { position: "absolute", bottom: "2px", left: "-10px", width: "110%", height: "8px", background: accentColor, opacity: 0.2, zIndex: -1 },
      h2Right: { fontSize: baseFontSize * 1.3, fontWeight: "900", textTransform: "uppercase", marginBottom: "1.25rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "10px" },
      h2RightSquare: { width: "12px", height: "12px", background: accentColor },
      textSm: { fontSize: baseFontSize * 0.95 },
      textXs: { fontSize: baseFontSize * 0.85, color: "#64748B" },
      contactItem: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", fontSize: baseFontSize * 0.9 },
      itemRight: { marginBottom: "1.5rem" },
      titleRight: { fontWeight: "800", fontSize: "1.1em", color: "#0F172A" },
      subTitle: { fontWeight: "600", color: accentColor },
      dateStr: { fontSize: baseFontSize * 0.85, fontWeight: "600", color: "#64748B", marginTop: "2px" },
    };
  };

  // Render left/right sections dynamically
  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const typographyKey = key === "technical_skills" || key === "soft_skills" ? "skills" : (key === "about" ? "professional_summary" : key);
    const s = styles(typographyKey);
    const withSortable = (content) => (
      <SortableItem key={key} index={index} total={list.length} onMoveUp={() => move(list, setList, index, "up")} onMoveDown={() => move(list, setList, index, "down")}>
        {content}
      </SortableItem>
    );

    if (side === "left") {
      switch (key) {
        case "contact":
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Contact<div style={s.h2LeftDecor}></div></h2>
              {data.personal_info?.phone && <div style={s.contactItem}><Phone size={14} color={accentColor} /> {data.personal_info.phone}</div>}
              {data.personal_info?.email && <div style={s.contactItem}><Mail size={14} color={accentColor} /> {data.personal_info.email}</div>}
              {data.personal_info?.location && <div style={s.contactItem}><MapPin size={14} color={accentColor} /> {data.personal_info.location}</div>}
              {data.personal_info?.linkedin && <div style={s.contactItem}><Linkedin size={14} color={accentColor} /> {data.personal_info.linkedin}</div>}
              {data.personal_info?.website && <div style={s.contactItem}><Globe size={14} color={accentColor} /> {data.personal_info.website}</div>}
            </section>
          );
        case "technical_skills":
          if (!hasItems(data.skills?.technicalSkills)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Tech Skills<div style={s.h2LeftDecor}></div></h2>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: s.textSm.fontSize }}>
                {data.skills.technicalSkills.map((sk, i) => <li key={i} style={{ marginBottom: "4px" }}>{sk}</li>)}
              </ul>
            </section>
          );
        case "soft_skills":
          if (!hasItems(data.skills?.softSkills)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Core Skills<div style={s.h2LeftDecor}></div></h2>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: s.textSm.fontSize }}>
                {data.skills.softSkills.map((sk, i) => <li key={i} style={{ marginBottom: "4px" }}>{sk}</li>)}
              </ul>
            </section>
          );
case "languages":
  if (!hasItems(data.languages)) return null;
  return withSortable(
    <section style={s.sectionLeft}>
      <h2 style={s.h2Left}>Languages<div style={s.h2LeftDecor}></div></h2>
      <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: s.textSm.fontSize }}>
        {data.languages.map((langObj, i) => (
          <li key={i} style={{ marginBottom: "4px" }}>
            {langObj.language} {langObj.proficiency ? `- ${langObj.proficiency}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
        default: return null;
      }
    } else {
      switch (key) {
        case "about":
          if (!data.professional_summary) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}><div style={s.h2RightSquare}></div> Profile</h2>
              <p style={s.textSm}>{data.professional_summary}</p>
            </section>
          );
        case "experience":
          if (!hasItems(data.experience)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}><div style={s.h2RightSquare}></div> Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={s.titleRight}>{exp.position}</div>
                    <div style={s.dateStr}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                  </div>
                  <div style={{ ...s.textSm, ...s.subTitle, marginBottom: "0.5rem" }}>{exp.company}</div>
                  <p style={s.textSm}>{exp.description}</p>
                </div>
              ))}
            </section>
          );
        case "education":
          if (!hasItems(data.education)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}><div style={s.h2RightSquare}></div> Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={s.titleRight}>{edu.degree}</div>
                    <div style={s.dateStr}>{edu.graduation_date}</div>
                  </div>
                  <div style={{ ...s.textSm, ...s.subTitle }}>{edu.institution}</div>
                </div>
              ))}
            </section>
          );
        case "projects":
          if (!hasItems(data.projects)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}><div style={s.h2RightSquare}></div> Projects</h2>
              {data.projects.map((proj, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.titleRight}>{proj.name}</div>
                  <p style={{ ...s.textSm, marginTop: "0.25rem" }}>{proj.description}</p>
                </div>
              ))}
            </section>
          );
       case "achievements":
  if (!hasItems(data.achievements)) return null;
  return withSortable(
    <section style={s.sectionRight}>
      <h2 style={s.h2Right}><div style={s.h2RightSquare}></div> Achievements</h2>
      {data.achievements.map((ach, i) => (
        <div key={i} style={s.itemRight}>
          <div style={s.titleRight}>{ach.title} ({ach.year})</div>
          <p style={{ ...s.textSm, marginTop: "0.25rem" }}>{ach.description}</p>
        </div>
      ))}
    </section>
  );
        default: return null;
      }
    }
  };

  const hl = styles("header");

  return (
    <div style={hl.page}>
      <div style={hl.topGeometry}></div>
      <div style={hl.bottomGeometry}></div>
      <div style={hl.columns}>
        <aside style={hl.leftCol}>
          {leftSections.map((key, i) => renderSection(key, i, "left"))}
        </aside>
        <main style={hl.rightCol}>
          <div style={hl.name}>{data.personal_info?.full_name}</div>
          {data.personal_info?.profession && <div style={hl.profession}>{data.personal_info.profession}</div>}
          {rightSections.map((key, i) => renderSection(key, i, "right"))}
        </main>
      </div>
    </div>
  );
};

export default React.memo(GeometricModernTemplate);