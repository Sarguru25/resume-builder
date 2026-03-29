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

const ElegantSerifTemplate = ({ data, accentColor = "#8C1515", sectionTypographies = {}, leftSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  // Default section order
  const defaultOrder = useMemo(() => [
    "professional_summary",
    "experience",
    "education",
    "projects",
    "technical_skills",
    "soft_skills",
    "achievements",
    "participations",
    "languages"
  ], []);

  const customKeys = useMemo(() => data?.custom_sections?.map((_, i) => `custom_${i}`) || [], [data?.custom_sections]);
  const [sections, setSections] = useState(leftSectionOrder || [...defaultOrder, ...customKeys]);

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = { header: { fontFamily: "'Playfair Display', 'Merriweather', 'Georgia', serif", fontSize: 13, lineHeight: 1.6 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "4rem 5rem", background: "#FAFAFA", color: "#111", fontFamily: t.fontFamily },
      section: { marginBottom: "2.5rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2: { fontSize: baseFontSize * 1.4, fontWeight: "normal", fontStyle: "italic", color: accentColor, marginBottom: "1.25rem", textAlign: "center", position: "relative" },
      h2Line: { position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#E5E7EB", zIndex: 1 },
      h2Text: { background: "#FAFAFA", padding: "0 15px", position: "relative", zIndex: 2, display: "inline-block" },
      textSm: { fontSize: baseFontSize * 0.95, color: "#444" },
      textXs: { fontSize: baseFontSize * 0.85, color: "#666" },
      header: { textAlign: "center", marginBottom: "3.5rem" },
      name: { fontSize: baseFontSize * 2.8, fontWeight: "normal", letterSpacing: "1px", color: "#111", marginBottom: "0.25rem" },
      profession: { fontSize: baseFontSize * 1.1, fontWeight: "normal", fontStyle: "italic", color: accentColor, marginBottom: "1rem" },
      contactRow: { display: "flex", justifyContent: "center", gap: "1rem", fontSize: baseFontSize * 0.85, color: "#666", flexWrap: "wrap", textTransform: "uppercase", letterSpacing: "1px" },
      item: { marginBottom: "2rem" },
      titleGroup: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" },
      position: { fontWeight: "bold", fontSize: baseFontSize * 1.05, color: "#111" },
      company: { fontStyle: "italic", fontSize: baseFontSize * 0.95, color: "#444" },
      skillsList: { display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" },
      skillPill: { padding: "0.25rem 0.5rem", backgroundColor: "#f1f5f9", color: "#111", borderRadius: "4px", fontSize: baseFontSize * 0.85, fontWeight: 500, border: "1px solid #e2e8f0" }
    };
  };

  const renderSection = (key, index) => {
    const s = styles(key);
    const withSortable = (content) => <SortableItem key={key} index={index} total={sections.length} onMoveUp={() => move(sections, setSections, index, "up")} onMoveDown={() => move(sections, setSections, index, "down")}>{content}</SortableItem>;

    switch (key) {
      case "professional_summary":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Professional Summary</span></h2>
            <p style={{...s.textSm, textAlign: "justify"}}>{data.professional_summary}</p>
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Professional Experience</span></h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={s.titleGroup}>
                  <div style={s.position}>{exp.position}</div>
                  <div style={s.textXs}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                </div>
                <div style={{...s.company, marginBottom: "0.5rem"}}>{exp.company}</div>
                {exp.description && <p style={{...s.textSm, textAlign: "justify"}}>{exp.description}</p>}
              </div>
            ))}
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Education</span></h2>
            {data.education.map((edu, i) => (
              <div key={i} style={s.item}>
                <div style={s.titleGroup}>
                  <div style={s.position}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                  <div style={s.textXs}>{edu.graduation_date}</div>
                </div>
                <div style={s.company}>{edu.institution}</div>
                {edu.gpa && <div style={s.textSm}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Projects</span></h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={s.item}>
                <div style={s.position}>{proj.name}</div>
                {proj.type && <div style={s.textXs}>{proj.type}</div>}
                {proj.description && <p style={{...s.textSm, textAlign: "justify"}}>{proj.description}</p>}
              </div>
            ))}
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={{...s.section, textAlign: "center"}}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Technical Skills</span></h2>
            <div style={s.skillsList}>
              {data.skills.technicalSkills.map((skill, i) => <span key={i} style={s.skillPill}>{skill}</span>)}
            </div>
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={{...s.section, textAlign: "center"}}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Soft Skills</span></h2>
            <div style={s.skillsList}>
              {data.skills.softSkills.map((skill, i) => <span key={i} style={s.skillPill}>{skill}</span>)}
            </div>
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={{...s.section, textAlign: "center"}}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Languages</span></h2>
            <div style={s.skillsList}>
              {data.languages.map((lang, i) => <span key={i} style={s.skillPill}>{lang.language} {lang.proficiency && `(${lang.proficiency})`}</span>)}
            </div>
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Achievements</span></h2>
            {data.achievements.map((ach, i) => <div key={i} style={s.textSm}>• {ach.title}{ach.description ? `: ${ach.description}` : ""}</div>)}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>Participations</span></h2>
            {data.participations.map((p, i) => <div key={i} style={s.textSm}>• {p.title} {p.organization && `(${p.organization})`}</div>)}
          </section>
        );

      default:
        const customIndex = key.startsWith("custom_") ? parseInt(key.split("_")[1], 10) : null;
        if (customIndex !== null && data.custom_sections?.[customIndex]) {
          const custom = data.custom_sections[customIndex];
          if (!hasItems(custom.items)) return null;
          return withSortable(
            <section style={s.section}>
              <h2 style={s.h2}><span style={s.h2Line}></span><span style={s.h2Text}>{custom.section_title}</span></h2>
              {custom.items.map((item, i) => (
                <div key={i} style={s.item}>
                  <div style={s.position}>{item.title}</div>
                  {item.description && <p style={{...s.textSm, textAlign: "justify"}}>{item.description}</p>}
                </div>
              ))}
            </section>
          );
        }
        return null;
    }
  };

  const h = styles("header");
  const contactParts = [
    { icon: Mail, value: data.personal_info?.email },
    { icon: Phone, value: data.personal_info?.phone },
    { icon: MapPin, value: data.personal_info?.location },
    { icon: Linkedin, value: data.personal_info?.linkedin },
    { icon: Globe, value: data.personal_info?.website }
  ].filter(c => c.value);

  return (
    <div style={h.page}>
      <header style={h.header}>
        <div style={h.name}>{data.personal_info?.full_name}</div>
        {data.personal_info?.profession && <div style={h.profession}>{data.personal_info.profession}</div>}
        <div style={h.contactRow}>
          {contactParts.map((c, i) => {
            const Icon = c.icon;
            return <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}><Icon size={12} /> {c.value}</span>;
          })}
        </div>
      </header>
      <main>{sections.map((key, i) => renderSection(key, i))}</main>
    </div>
  );
};

export default React.memo(ElegantSerifTemplate);