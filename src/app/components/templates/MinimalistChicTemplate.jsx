import React, { useState, useMemo } from "react";
import { GripVertical } from "lucide-react";

const SortableItem = ({ index, total, onMoveUp, onMoveDown, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ position: "absolute", left: "-28px", top: "4px", display: "flex", flexDirection: "column", gap: "4px", opacity: hover ? 1 : 0, transition: "opacity 0.2s" }} className="print:hidden">
        <GripVertical size={14} color="#e5e7eb" />
        {index > 0 && <button onClick={onMoveUp} style={btnStyle}>↑</button>}
        {index < total - 1 && <button onClick={onMoveDown} style={btnStyle}>↓</button>}
      </div>
      {children}
    </div>
  );
};
const btnStyle = { border: "none", background: "#f3f4f6", borderRadius: "4px", fontSize: "10px", cursor: "pointer", padding: "2px 4px", lineHeight: 1 };

const MinimalistChicTemplate = ({ data, accentColor = "#111", sectionTypographies = {}, leftSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultOrder = useMemo(() => ["professional_summary", "experience", "education", "projects", "technical_skills", "soft_skills", "achievements", "participations", "languages"], []);
  const customKeys = useMemo(() => data?.custom_sections?.map((_, i) => `custom_${i}`) || [], [data?.custom_sections]);
  const [sections, setSections] = useState(leftSectionOrder || [...defaultOrder, ...customKeys]);

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = { header: { fontFamily: "'Garamond', 'Playfair Display', serif", fontSize: 13, lineHeight: 1.8 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    const sansSerif = "'Inter', 'Helvetica', sans-serif";
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "4rem 5rem", background: "#fff", color: "#333", fontFamily: t.fontFamily },
      section: { marginBottom: "3rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2: { fontSize: baseFontSize * 0.9, fontWeight: "400", color: "#9CA3AF", marginBottom: "1.5rem", letterSpacing: "2px", textTransform: "uppercase", fontFamily: sansSerif },
      textSm: { fontSize: baseFontSize * 0.85, fontFamily: sansSerif, color: "#555" },
      textXs: { fontSize: baseFontSize * 0.75, color: "#9CA3AF", fontFamily: sansSerif },
      header: { textAlign: "center", marginBottom: "4rem" },
      name: { fontSize: baseFontSize * 2.2, fontWeight: "400", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "0.5rem" },
      profession: { fontSize: baseFontSize * 0.9, fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", fontFamily: sansSerif, color: "#111" },
      contactRow: { display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem", fontSize: baseFontSize * 0.75, fontFamily: sansSerif, color: "#555", flexWrap: "wrap" },
      item: { marginBottom: "2rem" },
      titleGroup: { marginBottom: "0.5rem" },
      position: { fontWeight: "700", textTransform: "uppercase", fontSize: baseFontSize * 0.9, fontFamily: sansSerif, color: "#111" },
      company: { textTransform: "uppercase", fontSize: baseFontSize * 0.85, fontFamily: sansSerif, color: "#555" },
      descLi: { marginBottom: "0.25rem", color: "#555" },
      skillPill: { padding: "0.25rem 0.5rem", backgroundColor: "#f1f5f9", color: "#111", borderRadius: "4px", fontSize: baseFontSize * 0.85, fontWeight: 500, border: "1px solid #e2e8f0", marginBottom: "0.25rem", display: "inline-block" }
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
            <h2 style={s.h2}>Professional Summary</h2>
            <p style={s.textSm}>{data.professional_summary}</p>
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={s.titleGroup}>
                  <div style={s.position}>{exp.position}</div>
                  <div style={s.company}>{exp.company} | {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}</div>
                </div>
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
                <div style={s.position}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                <div style={s.company}>{edu.institution} | {edu.graduation_date}</div>
                {edu.gpa && <p style={s.textSm}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={s.item}>
                <div style={s.position}>{proj.name}</div>
                {proj.type && <div style={s.company}>{proj.type}</div>}
                {proj.description && <p style={s.textSm}>{proj.description}</p>}
              </div>
            ))}
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Technical Skills</h2>
            {data.skills.technicalSkills.map((skill, i) => <span key={i} style={s.skillPill}>{skill}</span>)}
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Soft Skills</h2>
            {data.skills.softSkills.map((skill, i) => <span key={i} style={s.skillPill}>{skill}</span>)}
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Languages</h2>
            {data.languages.map((lang, i) => <span key={i} style={s.skillPill}>{lang.language} {lang.proficiency && `(${lang.proficiency})`}</span>)}
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Achievements</h2>
            {data.achievements.map((ach, i) => (
              <div key={i} style={s.item}>
                <div style={s.position}>{ach.title}</div>
                {ach.description && <p style={s.textSm}>{ach.description}</p>}
              </div>
            ))}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Participations</h2>
            {data.participations.map((part, i) => (
              <div key={i} style={s.item}>
                <div style={s.position}>{part.title}</div>
                {part.organization && <div style={s.company}>{part.organization}</div>}
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
                  <div style={s.position}>{item.title}</div>
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
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
          {data.personal_info?.phone && <span>| {data.personal_info.phone}</span>}
          {data.personal_info?.email && <span>| {data.personal_info.email}</span>}
          {data.personal_info?.linkedin && <span>| {data.personal_info.linkedin}</span>}
          {data.personal_info?.website && <span>| {data.personal_info.website}</span>}
        </div>
      </header>
      <main>
        {sections.map((key, i) => renderSection(key, i))}
      </main>
    </div>
  );
};

export default React.memo(MinimalistChicTemplate);