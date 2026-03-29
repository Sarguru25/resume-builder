import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

const SortableItem = ({ index, total, onMoveUp, onMoveDown, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ position: "absolute", left: "-28px", top: "4px", display: "flex", flexDirection: "column", gap: "4px", opacity: hover ? 1 : 0, transition: "opacity 0.2s", zIndex: 10 }} className="print:hidden">
        <GripVertical size={14} color="#9ca3af" />
        {index > 0 && <button onClick={onMoveUp} style={btnStyle}>↑</button>}
        {index < total - 1 && <button onClick={onMoveDown} style={btnStyle}>↓</button>}
      </div>
      {children}
    </div>
  );
};
const btnStyle = { border: "none", background: "#e5e7eb", borderRadius: "4px", fontSize: "10px", cursor: "pointer", padding: "2px 4px", lineHeight: 1 };

const TimelineJourneyTemplate = ({ data, accentColor = "#D946EF", sectionTypographies = {}, leftSectionOrder, rightSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultLeft = useMemo(() => ["contact", "about", "technical_skills", "soft_skills", "languages"], []);
  const defaultRight = useMemo(() => ["experience", "education", "projects", "achievements", "participations"], []);

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

  const baseTypography = { header: { fontFamily: "'Outfit', 'Roboto', sans-serif", fontSize: 13, lineHeight: 1.5 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;

    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "3rem", display: "flex", gap: "2.5rem", background: "#fff", color: "#1F2937", fontFamily: t.fontFamily },
      leftCol: { width: "35%", display: "flex", flexDirection: "column", gap: "2rem" },
      rightCol: { width: "65%", position: "relative" },
      timelineLine: { position: "absolute", left: "6px", top: "0", bottom: "0", width: "2px", background: "#E5E7EB" },
      header: { marginBottom: "1rem" },
      name: { fontSize: baseFontSize * 3, fontWeight: "800", lineHeight: 1, letterSpacing: "-1px", marginBottom: "0.5rem" },
      profession: { fontSize: baseFontSize * 1.2, fontWeight: "500", color: accentColor },
      sectionLeft: { fontSize: baseFontSize, lineHeight: t.lineHeight },
      sectionRight: { marginBottom: "2rem", fontSize: baseFontSize, lineHeight: t.lineHeight, paddingLeft: "2rem", position: "relative" },
      h2Left: { fontSize: baseFontSize * 1.1, fontWeight: "700", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "1px" },
      h2Right: { fontSize: baseFontSize * 1.4, fontWeight: "800", color: accentColor, marginBottom: "1.5rem", background: "#fff", display: "inline-block", paddingRight: "10px", position: "relative", zIndex: 1 },
      textSm: { fontSize: baseFontSize * 0.95 },
      textXs: { fontSize: baseFontSize * 0.85, color: "#6B7280" },
      itemRight: { marginBottom: "2rem", position: "relative" },
      timelineDotOuter: { position: "absolute", left: "-2rem", top: "4px", width: "14px", height: "14px", borderRadius: "50%", background: "#fff", border: `2px solid ${accentColor}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, marginLeft: "-7px" },
      timelineDotInner: { width: "6px", height: "6px", borderRadius: "50%", background: accentColor },
      titleRight: { fontWeight: "700", fontSize: "1.1em" },
      dateStr: { fontSize: baseFontSize * 0.85, fontWeight: "600", color: accentColor, background: `${accentColor}15`, padding: "2px 8px", borderRadius: "12px", display: "inline-block", marginBottom: "0.25rem" },
      contactItem: { display: "flex", gap: "0.5rem", marginBottom: "0.5rem", fontSize: baseFontSize * 0.9 },
      skillPill: { padding: "4px 8px", background: "#F3F4F6", borderRadius: "4px", fontSize: baseFontSize * 0.85, border: "1px solid #E5E7EB" },
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
              {data.personal_info?.phone && <div style={s.contactItem}><Phone size={16} color={accentColor} /> {data.personal_info.phone}</div>}
              {data.personal_info?.email && <div style={s.contactItem}><Mail size={16} color={accentColor} /> {data.personal_info.email}</div>}
              {data.personal_info?.location && <div style={s.contactItem}><MapPin size={16} color={accentColor} /> {data.personal_info.location}</div>}
              {data.personal_info?.linkedin && <div style={s.contactItem}><Linkedin size={16} color={accentColor} /> {data.personal_info.linkedin}</div>}
              {data.personal_info?.website && <div style={s.contactItem}><Globe size={16} color={accentColor} /> {data.personal_info.website}</div>}
            </section>
          );
        case "about":
          if (!data.professional_summary) return null;
          return withSortable(<section style={s.sectionLeft}><h2 style={s.h2Left}>About</h2><p style={s.textSm}>{data.professional_summary}</p></section>);
        case "technical_skills":
          if (!hasItems(data.skills?.technicalSkills)) return null;
          return withSortable(<section style={s.sectionLeft}><h2 style={s.h2Left}>Hard Skills</h2><div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>{data.skills.technicalSkills.map(sk => <span key={sk} style={s.skillPill}>{sk}</span>)}</div></section>);
        case "soft_skills":
          if (!hasItems(data.skills?.softSkills)) return null;
          return withSortable(<section style={s.sectionLeft}><h2 style={s.h2Left}>Soft Skills</h2><div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>{data.skills.softSkills.map(sk => <span key={sk} style={s.skillPill}>{sk}</span>)}</div></section>);
        case "languages":
          if (!hasItems(data.languages)) return null;
          return withSortable(<section style={s.sectionLeft}><h2 style={s.h2Left}>Languages</h2><div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>{data.languages.map(lang => <span key={lang.language} style={s.skillPill}>{lang.language} {lang.proficiency && `(${lang.proficiency})`}</span>)}</div></section>);
        default:
          if (key.startsWith("custom_")) {
            const idx = Number(key.split("_")[1]);
            const cs = data.custom_sections?.[idx];
            if (!cs || !hasItems(cs.items)) return null;
            return withSortable(
              <section style={s.sectionLeft}>
                <h2 style={s.h2Left}>{cs.section_title}</h2>
                {cs.items.map((item, i) => (
                  <div key={i} style={{marginBottom: "0.5rem"}}><strong>{item.title}</strong>{item.description && <p style={s.textSm}>{item.description}</p>}</div>
                ))}
              </section>
            );
          }
          return null;
      }
    } else {
      switch (key) {
        case "experience":
          if (!hasItems(data.experience)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.timelineDotOuter}><div style={s.timelineDotInner}></div></div>
                  <div style={s.dateStr}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                  <div style={s.titleRight}>{exp.position}</div>
                  <div style={{...s.textSm, fontWeight: "500", color: "#4B5563", marginBottom: "0.5rem"}}>{exp.company}</div>
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
                  <div style={s.timelineDotOuter}><div style={s.timelineDotInner}></div></div>
                  <div style={s.dateStr}>{edu.graduation_date}</div>
                  <div style={s.titleRight}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                  <div style={{...s.textSm, color: "#4B5563"}}>{edu.institution}</div>
                  {edu.gpa && <div style={s.textSm}>GPA: {edu.gpa}</div>}
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
                  <div style={s.timelineDotOuter}><div style={s.timelineDotInner}></div></div>
                  <div style={s.titleRight}>{proj.name}</div>
                  {proj.type && <div style={{...s.textSm, color: "#6B7280"}}>{proj.type}</div>}
                  <p style={{...s.textSm, marginTop: "0.25rem"}}>{proj.description}</p>
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
                  <div style={s.timelineDotOuter}><div style={s.timelineDotInner}></div></div>
                  <div style={s.titleRight}>{ach.title}</div>
                  {ach.description && <p style={s.textSm}>{ach.description}</p>}
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
                  <div style={s.timelineDotOuter}><div style={s.timelineDotInner}></div></div>
                  <div style={s.titleRight}>{part.title}</div>
                  {part.organization && <div style={{...s.textSm, color: "#4B5563"}}>{part.organization}</div>}
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
              <section style={s.sectionRight}>
                <h2 style={s.h2Right}>{cs.section_title}</h2>
                {cs.items.map((item, i) => (
                  <div key={i} style={s.itemRight}>
                    <div style={s.timelineDotOuter}><div style={s.timelineDotInner}></div></div>
                    <div style={s.titleRight}>{item.title}</div>
                    {item.description && <p style={s.textSm}>{item.description}</p>}
                  </div>
                ))}
              </section>
            );
          }
          return null;
      }
    }
  };

  const hl = styles("header");
  return (
    <div style={hl.page}>
      <aside style={hl.leftCol}>
        <div style={hl.header}>
          <div style={hl.name}>{data.personal_info?.full_name}</div>
          {data.personal_info?.profession && <div style={hl.profession}>{data.personal_info.profession}</div>}
        </div>
        {leftSections.map((key, i) => renderSection(key, i, "left"))}
      </aside>
      <main style={hl.rightCol}>
        <div style={hl.timelineLine}></div>
        {rightSections.map((key, i) => renderSection(key, i, "right"))}
      </main>
    </div>
  );
};

export default React.memo(TimelineJourneyTemplate);