import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

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

const InfographicMasterTemplate = ({
  data,
  accentColor = "#D97706",
  sectionTypographies = {},
  leftSectionOrder,
  rightSectionOrder,
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultLeft = useMemo(
    () => ["contact", "about", "technical_skills", "soft_skills", "languages"],
    []
  );
  const defaultRight = useMemo(
    () => ["experience", "education", "projects", "participations", "achievements", "custom_sections"],
    []
  );

  const customKeys = useMemo(
    () => data?.custom_sections?.map((_, i) => `custom_${i}`) || [],
    [data?.custom_sections]
  );

  const [leftSections, setLeftSections] = useState(leftSectionOrder || defaultLeft);
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
    header: { fontFamily: "'Nunito', 'Segoe UI', sans-serif", fontSize: 13, lineHeight: 1.5 },
  };
  const merged = { ...baseTypography, ...sectionTypographies };
  const primaryColor = "#1D4ED8";

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "0.5rem", background: "#F1F5F9", color: "#333", fontFamily: t.fontFamily },
      container: { background: "#fff", height: "100%", width: "100%", borderRadius: "16px", overflow: "hidden", display: "flex" },
      leftCol: { width: "38%", background: primaryColor, color: "#fff", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" },
      rightCol: { width: "62%", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" },
      avatar: { width: "120px", height: "120px", borderRadius: "50%", background: accentColor, margin: "0 auto", border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "bold" },
      name: { fontSize: baseFontSize * 2, fontWeight: "900", textAlign: "center", marginTop: "1rem", lineHeight: 1.1 },
      profession: { fontSize: baseFontSize * 1.1, textAlign: "center", color: "#DBEAFE", fontWeight: "600", marginTop: "0.25rem" },
      sectionLeft: { marginBottom: "1rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      sectionRight: { marginBottom: "1rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2Left: { fontSize: baseFontSize * 1.1, fontWeight: "800", textTransform: "uppercase", marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.2)", paddingBottom: "0.5rem", letterSpacing: "1px" },
      h2Right: { fontSize: baseFontSize * 1.3, fontWeight: "800", textTransform: "uppercase", marginBottom: "1rem", color: primaryColor },
      textSm: { fontSize: baseFontSize * 0.9 },
      textXs: { fontSize: baseFontSize * 0.8, color: "#9CA3AF" },
      contactItem: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontSize: baseFontSize * 0.85, background: "rgba(255,255,255,0.1)", padding: "0.5rem", borderRadius: "8px" },
      itemRight: { marginBottom: "1.25rem", position: "relative", paddingLeft: "1.5rem", borderLeft: `2px solid ${accentColor}` },
      circleRight: { position: "absolute", left: "-6px", top: "4px", width: "10px", height: "10px", borderRadius: "50%", background: accentColor },
      pieContainer: { display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" },
      pieItem: { display: "flex", flexDirection: "column", alignItems: "center", width: "40%", textAlign: "center" },
      pieCircle: { width: "50px", height: "50px", borderRadius: "50%", background: `conic-gradient(${accentColor} ${Math.random() * 40 + 50}%, rgba(255,255,255,0.2) 0)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" },
      pieInner: { width: "36px", height: "36px", background: primaryColor, borderRadius: "50%" },
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const s = styles(key);
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
              {data.personal_info?.phone && <div style={s.contactItem}><Phone size={14} /> {data.personal_info.phone}</div>}
              {data.personal_info?.email && <div style={s.contactItem}><Mail size={14} /> {data.personal_info.email}</div>}
              {data.personal_info?.location && <div style={s.contactItem}><MapPin size={14} /> {data.personal_info.location}</div>}
              {data.personal_info?.linkedin && <div style={s.contactItem}><Linkedin size={14} /> {data.personal_info.linkedin}</div>}
              {data.personal_info?.website && <div style={s.contactItem}><Globe size={14} /> {data.personal_info.website}</div>}
            </section>
          );
        case "about":
          if (!data.professional_summary) return null;
          return withSortable(<section style={s.sectionLeft}><h2 style={s.h2Left}>Profile</h2><p style={s.textSm}>{data.professional_summary}</p></section>);
        case "technical_skills":
          if (!hasItems(data.skills?.technicalSkills)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Hard Skills</h2>
              <div style={s.pieContainer}>
                {data.skills.technicalSkills.map((sk, i) => (
                  <div key={i} style={s.pieItem}>
                    <div style={s.pieCircle}><div style={s.pieInner}></div></div>
                    <div style={{ fontSize: "0.75rem", fontWeight: "600" }}>{sk}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        case "soft_skills":
          if (!hasItems(data.skills?.softSkills)) return null;
          return withSortable(<section style={s.sectionLeft}><h2 style={s.h2Left}>Soft Skills</h2><div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{data.skills.softSkills.map((sk, i) => <span key={i} style={{ background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "12px", fontSize: s.textSm.fontSize }}>{sk}</span>)}</div></section>);
        case "languages":
          if (!hasItems(data.languages)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Languages</h2>
              <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                {data.languages.map((lang, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>{lang.language} - {lang.proficiency}</li>
                ))}
              </ul>
            </section>
          );
        default:
          return null;
      }
    } else {
      switch (key) {
        case "experience":
          if (!hasItems(data.experience)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Work Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.circleRight}></div>
                  <div style={{ fontWeight: "800", fontSize: "1.1em" }}>{exp.position}</div>
                  <div style={{ color: s.textXs.color, fontWeight: "600", marginBottom: "4px", fontSize: s.textSm.fontSize }}>{exp.company} | {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                  <p style={s.textSm}>{exp.description}</p>
                </div>
              ))}
            </section>
          );
        case "education":
          if (!hasItems(data.education)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={{ fontWeight: "800" }}>{edu.degree}</div>
                  <div style={{ color: s.textXs.color, fontSize: s.textSm.fontSize }}>{edu.institution}</div>
                  <div style={s.textXs}>{edu.graduation_date}</div>
                </div>
              ))}
            </section>
          );
        case "projects":
          if (!hasItems(data.projects)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Projects</h2>
              {data.projects.map((proj, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.circleRight}></div>
                  <strong style={{ fontWeight: "800" }}>{proj.name}</strong>
                  <p style={{ ...s.textSm, marginTop: "2px" }}>{proj.description}</p>
                </div>
              ))}
            </section>
          );
        case "participations":
          if (!hasItems(data.participations)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Participations</h2>
              {data.participations.map((part, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.circleRight}></div>
                  <strong style={{ fontWeight: "800" }}>{part.title}</strong>
                  <p style={{ ...s.textSm, marginTop: "2px" }}>{part.description}</p>
                </div>
              ))}
            </section>
          );
        case "achievements":
          if (!hasItems(data.achievements)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Achievements</h2>
              {data.achievements.map((ach, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.circleRight}></div>
                  <div style={{ fontWeight: "800" }}>{ach.title} ({ach.year})</div>
                  <p style={{ ...s.textSm, marginTop: "2px" }}>{ach.description}</p>
                </div>
              ))}
            </section>
          );
        case "custom_sections":
          if (!hasItems(data.custom_sections)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Custom Sections</h2>
              {data.custom_sections.map((cs, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.circleRight}></div>
                  <strong style={{ fontWeight: "800" }}>{cs.title}</strong>
                  <p style={{ ...s.textSm, marginTop: "2px" }}>{cs.content}</p>
                </div>
              ))}
            </section>
          );
        default:
          return null;
      }
    }
  };

  const h = styles("header");
  return (
    <div style={h.page}>
      <div style={h.container}>
        <aside style={h.leftCol}>
          <div>
            <div style={h.avatar}>{data.personal_info?.full_name ? data.personal_info.full_name.charAt(0) : "IMG"}</div>
            <div style={h.name}>{data.personal_info?.full_name}</div>
            {data.personal_info?.profession && <div style={h.profession}>{data.personal_info.profession}</div>}
          </div>
          {leftSections.map((key, i) => renderSection(key, i, "left"))}
        </aside>
        <main style={h.rightCol}>
          {rightSections.map((key, i) => renderSection(key, i, "right"))}
        </main>
      </div>
    </div>
  );
};

export default React.memo(InfographicMasterTemplate);