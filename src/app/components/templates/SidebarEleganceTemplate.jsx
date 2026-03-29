import React, { useState, useMemo } from "react";
import { GripVertical, Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const SortableItem = ({ index, total, onMoveUp, onMoveDown, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ position: "absolute", left: "-28px", top: "4px", display: "flex", flexDirection: "column", gap: "4px", opacity: hover ? 1 : 0, transition: "opacity 0.2s" }} className="print:hidden">
        <GripVertical size={14} color="#9ca3af" />
        {index > 0 && <button onClick={onMoveUp} style={btnStyle}>↑</button>}
        {index < total - 1 && <button onClick={onMoveDown} style={btnStyle}>↓</button>}
      </div>
      {children}
    </div>
  );
};
const btnStyle = { border: "none", background: "#e5e7eb", borderRadius: "4px", fontSize: "10px", cursor: "pointer", padding: "2px 4px", lineHeight: 1 };

const SidebarEleganceTemplate = ({ data, accentColor = "#D1D5DB", sectionTypographies = {}, leftSectionOrder, rightSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  // Default section order
  const defaultLeft = useMemo(() => ["contact", "technical_skills", "soft_skills", "education"], []);
  const defaultRight = useMemo(() => ["about", "experience", "projects", "achievements", "participations", "languages"], []);

  // Custom sections
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

  const baseTypography = { header: { fontFamily: "'Arial', sans-serif", fontSize: 12, lineHeight: 1.5 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "2rem", background: "#F3F4F6", color: "#1F2937", fontFamily: t.fontFamily },
      container: { display: "flex", background: "#fff", height: "100%", width: "100%", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
      leftCol: { width: "32%", background: "#1F2937", color: "#fff", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", gap: "2rem" },
      rightCol: { width: "68%", padding: "3rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" },
      avatar: { width: "100px", height: "100px", borderRadius: "50%", background: "#374151", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "bold" },
      name: { fontSize: baseFontSize * 1.8, fontWeight: "700", textAlign: "center", marginTop: "1rem", lineHeight: 1.2 },
      profession: { fontSize: baseFontSize * 1, textAlign: "center", color: accentColor, fontWeight: "500", marginTop: "0.25rem" },
      sectionLeft: { marginBottom: "1rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      sectionRight: { marginBottom: "1rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2Left: { fontSize: baseFontSize * 1, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.75rem", color: accentColor, borderBottom: "1px solid #374151", paddingBottom: "0.25rem" },
      h2Right: { fontSize: baseFontSize * 1.2, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", color: "#111827", borderBottom: `2px solid ${accentColor}`, paddingBottom: "0.25rem" },
      textSm: { fontSize: baseFontSize * 0.9 },
      textXs: { fontSize: baseFontSize * 0.8, color: "#6B7280" },
      contactItem: { marginBottom: "0.5rem", fontSize: baseFontSize * 0.85, color: "#D1D5DB", display: "flex", alignItems: "center", gap: "0.25rem" },
      itemRight: { marginBottom: "1.25rem" },
      skillBar: { background: "#374151", height: "4px", borderRadius: "2px", width: "100%", marginTop: "4px" },
      skillFill: { background: accentColor, height: "100%", borderRadius: "2px" }
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const typographyKey = key === "technical_skills" || key === "soft_skills" ? "skills" : (key === "about" ? "professional_summary" : key);
    const s = styles(typographyKey);
    const withSortable = (content) => <SortableItem key={key} index={index} total={list.length} onMoveUp={() => move(list, setList, index, "up")} onMoveDown={() => move(list, setList, index, "down")}>{content}</SortableItem>;

    if (side === "left") {
      switch (key) {
        case "contact":
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Contact</h2>
              {data.personal_info?.email && <div style={s.contactItem}><Mail size={12} /> {data.personal_info.email}</div>}
              {data.personal_info?.phone && <div style={s.contactItem}><Phone size={12} /> {data.personal_info.phone}</div>}
              {data.personal_info?.location && <div style={s.contactItem}><MapPin size={12} /> {data.personal_info.location}</div>}
              {data.personal_info?.linkedin && <div style={s.contactItem}><Linkedin size={12} /> {data.personal_info.linkedin}</div>}
              {data.personal_info?.website && <div style={s.contactItem}><Globe size={12} /> {data.personal_info.website}</div>}
            </section>
          );
        case "technical_skills":
          if (!hasItems(data.skills?.technicalSkills)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Technical Skills</h2>
              {data.skills.technicalSkills.map((sk, i) => (
                <div key={i} style={{marginBottom: "8px"}}>
                  <div style={{fontSize: s.textSm.fontSize, color: "#E5E7EB"}}>{sk}</div>
                  <div style={s.skillBar}><div style={{...s.skillFill, width: `${Math.floor(Math.random() * 40 + 60)}%`}}></div></div>
                </div>
              ))}
            </section>
          );
        case "soft_skills":
          if (!hasItems(data.skills?.softSkills)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Soft Skills</h2>
              {data.skills.softSkills.map((sk, i) => (
                <div key={i} style={{marginBottom: "8px"}}>{sk}</div>
              ))}
            </section>
          );
        case "education":
          if (!hasItems(data.education)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} style={{marginBottom: "1rem"}}>
                  <div style={{fontWeight: "600", fontSize: s.textSm.fontSize, color: "#E5E7EB"}}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                  <div style={{fontSize: s.textXs.fontSize, color: "#9CA3AF"}}>{edu.institution}</div>
                  <div style={{fontSize: s.textXs.fontSize, color: "#6B7280"}}>{edu.graduation_date}</div>
                  {edu.gpa && <div style={{fontSize: s.textXs.fontSize, color: "#6B7280"}}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          );
        default: return null;
      }
    } else {
      switch (key) {
        case "about":
          if (!data.professional_summary) return null;
          return withSortable(<section style={s.sectionRight}><h2 style={s.h2Right}>Professional Summary</h2><p style={s.textSm}>{data.professional_summary}</p></section>);
        case "experience":
          if (!hasItems(data.experience)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={{fontWeight: "700", fontSize: "1.1em", color: "#111827"}}>{exp.position}</div>
                  <div style={{color: "#4B5563", fontWeight: "500", marginBottom: "4px", fontSize: s.textSm.fontSize}}>{exp.company} | {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                  {exp.description && <p style={{...s.textSm, color: "#374151"}}>{exp.description}</p>}
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
                  <div style={{fontWeight: "600", color: "#111827"}}>{proj.name}</div>
                  {proj.type && <div style={{fontSize: s.textSm.fontSize, color: "#4B5563"}}>{proj.type}</div>}
                  {proj.description && <p style={{...s.textSm, color: "#374151"}}>{proj.description}</p>}
                </div>
              ))}
            </section>
          );
        case "achievements":
          if (!hasItems(data.achievements)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Honors & Achievements</h2>
              {data.achievements.map((ach, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={{fontWeight: "600", color: "#111827"}}>{ach.title}</div>
                  {ach.description && <p style={{...s.textSm, color: "#374151"}}>{ach.description}</p>}
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
                  <div style={{fontWeight: "600", color: "#111827"}}>{part.title}</div>
                  {part.organization && <div style={{fontSize: s.textSm.fontSize, color: "#4B5563"}}>{part.organization}</div>}
                  {part.description && <p style={{...s.textSm, color: "#374151"}}>{part.description}</p>}
                </div>
              ))}
            </section>
          );
        case "languages":
          if (!hasItems(data.languages)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Languages</h2>
              <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
                {data.languages.map((lang, i) => (
                  <span key={i} style={{padding: "0.25rem 0.5rem", backgroundColor: "#F3F4F6", color: "#111827", borderRadius: "4px", fontSize: s.textSm.fontSize, fontWeight: 500, border: "1px solid #E5E7EB"}}>
                    {lang.language} {lang.proficiency && `(${lang.proficiency})`}
                  </span>
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
              <section style={s.sectionRight}>
                <h2 style={s.h2Right}>{cs.section_title}</h2>
                {cs.items.map((item, i) => (
                  <div key={i} style={s.itemRight}>
                    <div style={{fontWeight: "600", color: "#111827"}}>{item.title}</div>
                    {item.description && <p style={{...s.textSm, color: "#374151"}}>{item.description}</p>}
                  </div>
                ))}
              </section>
            );
          }
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

export default React.memo(SidebarEleganceTemplate);