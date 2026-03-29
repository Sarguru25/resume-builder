import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

const btnStyle = { border: "none", background: "#e5e7eb", borderRadius: "4px", fontSize: "10px", cursor: "pointer", padding: "2px 4px", lineHeight: 1 };

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

const DesignerPortfolioTemplate = ({ data, accentColor = "#111827", sectionTypographies = {}, leftSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultSections = useMemo(() => [
    "about", "experience", "education", "projects", "technical_skills", "soft_skills", "languages", "certifications"
  ], []);

  const customKeys = useMemo(() => data?.custom_sections?.map((_, i) => `custom_${i}`) || [], [data?.custom_sections]);
  const [sections, setSections] = useState(leftSectionOrder || [...defaultSections, ...customKeys]);

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = { header: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 13, lineHeight: 1.6 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "3rem", background: "#fff", color: "#333", fontFamily: t.fontFamily },
      section: { marginBottom: "2rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2: { fontSize: baseFontSize * 1.3, fontWeight: "300", color: "#111", marginBottom: "1.25rem", letterSpacing: "2px", textTransform: "uppercase", borderBottom: `1px solid ${accentColor}20`, paddingBottom: "0.5rem" },
      textSm: { fontSize: baseFontSize * 0.9 },
      textXs: { fontSize: baseFontSize * 0.8, color: "#777" },
      header: { display: "flex", alignItems: "center", gap: "2rem", marginBottom: "3rem" },
      avatar: { width: "100px", height: "100px", borderRadius: "50%", background: "#F3F4F6", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAA", fontSize: "2rem" },
      headerText: { flex: 1 },
      name: { fontSize: baseFontSize * 2.8, fontWeight: "200", color: "#111", letterSpacing: "2px", marginBottom: "0.25rem", textTransform: "uppercase" },
      profession: { fontSize: baseFontSize * 1.1, color: "#666", fontWeight: "400", letterSpacing: "1px" },
      contactRow: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem", fontSize: baseFontSize * 0.8, alignItems: "center" },
      contactItem: { display: "inline-flex", alignItems: "center", gap: "0.25rem" },
      item: { marginBottom: "1.5rem" },
      skillRow: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" },
      skillDotContainer: { display: "flex", gap: "4px" },
      skillDot: (active) => ({ width: "8px", height: "8px", borderRadius: "50%", background: active ? accentColor : "#E5E7EB" })
    };
  };

 const renderSection = (key, index) => {
  const typographyKey = ["technical_skills", "soft_skills"].includes(key) ? "skills" : (key === "about" ? "professional_summary" : key);
  const s = styles(typographyKey);

  const withSortable = (content) => (
    <SortableItem key={key} index={index} total={sections.length} onMoveUp={() => move(sections, setSections, index, "up")} onMoveDown={() => move(sections, setSections, index, "down")}>
      {content}
    </SortableItem>
  );

  switch (key) {
    case "about":
      if (!data.professional_summary) return null;
      return withSortable(<section style={s.section}><h2 style={s.h2}>Profile</h2><p style={s.textSm}>{data.professional_summary}</p></section>);

    case "experience":
      if (!hasItems(data.experience)) return null;
      return withSortable(
        <section style={s.section}>
          <h2 style={s.h2}>Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} style={s.item}>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "0.25rem"}}>
                <strong style={{fontWeight: "500", fontSize: "1.1em"}}>{exp.position}</strong>
                <span style={s.textXs}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
              </div>
              <div style={{color: "#666", marginBottom: "0.5rem", fontSize: s.textSm.fontSize}}>{exp.company}</div>
              {exp.description && <p style={s.textSm}>{exp.description}</p>}
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
              <strong>{edu.degree}{edu.field && ` in ${edu.field}`}</strong>
              <div style={s.textXs}>{edu.institution} | {edu.graduation_date}</div>
            </div>
          ))}
        </section>
      );

    case "projects":
      if (!hasItems(data.projects)) return null;
      return withSortable(
        <section style={s.section}>
          <h2 style={s.h2}>Portfolio Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} style={s.item}>
              <strong>{proj.name}</strong>
              {proj.type && <div style={s.textXs}>{proj.type}</div>}
              {proj.description && <p style={s.textSm}>{proj.description}</p>}
            </div>
          ))}
        </section>
      );

    case "technical_skills":
      if (!hasItems(data.skills?.technicalSkills)) return null;
      return withSortable(
        <section style={s.section}>
          <h2 style={s.h2}>Design & Tech Skills</h2>
          {data.skills.technicalSkills.map((sk, i) => (
            <div key={i} style={s.skillRow}>
              <div style={{flex: 1, fontSize: s.textSm.fontSize}}>{sk}</div>
              <div style={s.skillDotContainer}>
                {[1,2,3,4,5].map(v => <div key={v} style={s.skillDot(v <= Math.floor(Math.random() * 2 + 3))} />)}
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
          {data.skills.softSkills.map((sk, i) => <div key={i} style={s.textSm}>• {sk}</div>)}
        </section>
      );

    case "languages":
      if (!hasItems(data.languages)) return null;
      return withSortable(
        <section style={s.section}>
          <h2 style={s.h2}>Languages</h2>
          {data.languages.map((lang, i) => <div key={i} style={s.textSm}>{lang.language} {lang.proficiency && `(${lang.proficiency})`}</div>)}
        </section>
      );

    case "certifications":
      if (!hasItems(data.certifications)) return null;
      return withSortable(
        <section style={s.section}>
          <h2 style={s.h2}>Certifications</h2>
          {data.certifications.map((cert, i) => (
            <div key={i} style={s.item}>
              <strong>{cert.title}</strong>
              {cert.description && <p style={s.textSm}>{cert.description}</p>}
            </div>
          ))}
        </section>
      );

    // **Achievements**
    case "achievements":
      if (!hasItems(data.achievements)) return null;
      return withSortable(
        <section style={s.section}>
          <h2 style={s.h2}>Achievements</h2>
          {data.achievements.map((ach, i) => (
            <div key={i} style={s.textSm}>• {ach.title}{ach.description ? `: ${ach.description}` : ""}</div>
          ))}
        </section>
      );

    // **Participant / Participation**
    case "participant":
      if (!hasItems(data.participant)) return null;
      return withSortable(
        <section style={s.section}>
          <h2 style={s.h2}>Participation</h2>
          {data.participant.map((p, i) => (
            <div key={i} style={s.textSm}>• {p.event}{p.role ? ` (${p.role})` : ""}</div>
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
            {cs.items.map((item, i) => <div key={i} style={s.item}><strong>{item.title}</strong>{item.description && <p style={s.textSm}>{item.description}</p>}</div>)}
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
        <div style={h.avatar}>{data.personal_info?.full_name ? data.personal_info.full_name.charAt(0) : "IMG"}</div>
        <div style={h.headerText}>
          <div style={h.name}>{data.personal_info?.full_name}</div>
          {data.personal_info?.profession && <div style={h.profession}>{data.personal_info.profession}</div>}
          <div style={h.contactRow}>
            {data.personal_info?.email && <span style={h.contactItem}><Mail size={12} /> {data.personal_info.email}</span>}
            {data.personal_info?.phone && <span style={h.contactItem}><Phone size={12} /> {data.personal_info.phone}</span>}
            {data.personal_info?.linkedin && <span style={h.contactItem}><Linkedin size={12} /> {data.personal_info.linkedin}</span>}
            {data.personal_info?.location && <span style={h.contactItem}><MapPin size={12} /> {data.personal_info.location}</span>}
            {data.personal_info?.website && <span style={h.contactItem}><Globe size={12} /> {data.personal_info.website}</span>}
          </div>
        </div>
      </header>
      <div>{sections.map((key, i) => renderSection(key, i))}</div>
    </div>
  );
};

export default React.memo(DesignerPortfolioTemplate);