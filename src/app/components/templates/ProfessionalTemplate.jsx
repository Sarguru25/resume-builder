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
          position: "absolute", left: "-28px", top: "4px", display: "flex", flexDirection: "column", gap: "4px", opacity: hover ? 1 : 0, transition: "opacity 0.2s", zIndex: 10
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

const ProfessionalTemplate = ({
  data,
  accentColor = "#0f172a",
  sectionTypographies = {},
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;
  
  const initialSections = useMemo(() => {
    const base = ["professional_summary", "experience", "education", "projects", "technical_skills", "soft_skills", "achievements", "participations", "languages"];
    const custom = data?.custom_sections?.map((_, i) => `custom_${i}`) || [];
    return [...base, ...custom];
  }, [data?.custom_sections]);

  const [sections, setSections] = useState(initialSections);

  const moveSection = (index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= sections.length) return;
    const copy = [...sections];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setSections(copy);
  };

  const baseTypography = {
    header: { fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.6 },
  };
  const merged = { ...baseTypography, ...sectionTypographies };

  const getStyles = (key) => {
    const typographyKey = key === "technical_skills" || key === "soft_skills" ? "skills" : key;
    const t = { ...merged.header, ...merged[typographyKey] };
    const baseFontSize = t.fontSize;

    return {
      page: {
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "2.5rem 3rem",
        background: "#fff",
        color: "#1e293b",
        fontFamily: t.fontFamily,
      },
      header: {
        borderBottom: `2px solid ${accentColor}`,
        paddingBottom: "1rem",
        marginBottom: "1.5rem",
        textAlign: "center",
      },
      name: {
        fontSize: baseFontSize * 2,
        fontWeight: 700,
        color: accentColor,
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: "0.25rem",
      },
      profession: {
        fontSize: baseFontSize * 1.1,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "1px",
        marginBottom: "0.75rem",
      },
      contactRow: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "1rem",
        fontSize: baseFontSize * 0.85,
        color: "#334155",
      },
      contactItem: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
      },
      section: {
        marginBottom: "1.5rem",
        fontSize: baseFontSize,
        lineHeight: t.lineHeight,
        fontFamily: t.fontFamily,
      },
      h2: {
        fontSize: baseFontSize * 1.2,
        fontWeight: 600,
        color: accentColor,
        borderBottom: "1px solid #cbd5e1",
        marginBottom: "0.75rem",
        paddingBottom: "0.25rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
      },
      item: {
        marginBottom: "1rem",
      },
      between: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "0.25rem",
      },
      title: {
        fontWeight: 600,
        color: "#0f172a",
        fontSize: baseFontSize * 1.05,
      },
      dateInfo: {
        fontSize: baseFontSize * 0.85,
        color: "#475569",
        fontWeight: 500,
      },
      subtitle: {
        fontSize: baseFontSize * 0.95,
        color: accentColor,
        fontWeight: 500,
        fontStyle: "italic",
        marginBottom: "0.25rem"
      },
      textBody: {
        fontSize: baseFontSize * 0.9,
        color: "#334155",
        marginTop: "0.25rem",
      },
      skillsList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
      },
      skillPill: {
        padding: "0.25rem 0.5rem",
        backgroundColor: "#f1f5f9",
        color: "#0f172a",
        borderRadius: "4px",
        fontSize: baseFontSize * 0.85,
        fontWeight: 500,
        border: "1px solid #e2e8f0"
      }
    };
  };

  const s = getStyles("header");

  const renderSection = (key, index) => {
    const styles = getStyles(key);
    const withSortable = (content) => (
      <SortableItem key={key} index={index} total={sections.length} onMoveUp={() => moveSection(index, "up")} onMoveDown={() => moveSection(index, "down")}>
        {content}
      </SortableItem>
    );

    switch (key) {
      case "professional_summary":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Professional Summary</h2>
            <p style={styles.textBody}>{data.professional_summary}</p>
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Professional Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={styles.item}>
                <div style={styles.between}>
                  <div style={styles.title}>{exp.position}</div>
                  <div style={styles.dateInfo}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                </div>
                <div style={styles.subtitle}>{exp.company}</div>
                {exp.description && <div style={{...styles.textBody, whiteSpace: "pre-wrap"}}>{exp.description}</div>}
              </div>
            ))}
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={styles.item}>
                <div style={styles.between}>
                  <div style={styles.title}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                  <div style={styles.dateInfo}>{edu.graduation_date}</div>
                </div>
                <div style={styles.subtitle}>{edu.institution}</div>
                {edu.gpa && <div style={styles.textBody}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Key Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={styles.item}>
                <div style={styles.between}>
                  <div style={styles.title}>{proj.name}</div>
                  {proj.type && <div style={styles.dateInfo}>{proj.type}</div>}
                </div>
                {proj.description && <div style={styles.textBody}>{proj.description}</div>}
              </div>
            ))}
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Technical Skills</h2>
            <div style={styles.skillsList}>
              {data.skills.technicalSkills.map((skill, i) => (
                <span key={i} style={styles.skillPill}>{skill}</span>
              ))}
            </div>
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Soft Skills</h2>
            <div style={styles.skillsList}>
              {data.skills.softSkills.map((skill, i) => (
                <span key={i} style={styles.skillPill}>{skill}</span>
              ))}
            </div>
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Languages</h2>
            <div style={styles.skillsList}>
              {data.languages.map((lang, i) => (
                <span key={i} style={styles.skillPill}>{lang.language} {lang.proficiency && `(${lang.proficiency})`}</span>
              ))}
            </div>
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Honors & Achievements</h2>
            {data.achievements.map((ach, i) => (
              <div key={i} style={styles.item}>
                <div style={styles.title}>{ach.title}</div>
                {ach.description && <div style={styles.textBody}>{ach.description}</div>}
              </div>
            ))}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={styles.section}>
            <h2 style={styles.h2}>Participations</h2>
            {data.participations.map((part, i) => (
              <div key={i} style={styles.item}>
                <div style={styles.between}>
                  <div style={styles.title}>{part.title}</div>
                </div>
                {part.organization && <div style={styles.subtitle}>{part.organization}</div>}
                {part.description && <div style={styles.textBody}>{part.description}</div>}
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
            <section style={styles.section}>
              <h2 style={styles.h2}>{cs.section_title}</h2>
              {cs.items.map((item, i) => (
                <div key={i} style={styles.item}>
                  <div style={styles.title}>{item.title}</div>
                  {item.description && <div style={styles.textBody}>{item.description}</div>}
                </div>
              ))}
            </section>
          );
        }
        return null;
    }
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={s.name}>{data.personal_info?.full_name}</div>
        {data.personal_info?.profession && <div style={s.profession}>{data.personal_info.profession}</div>}
        <div style={s.contactRow}>
          {data.personal_info?.email && <span style={s.contactItem}><Mail size={12} /> {data.personal_info.email}</span>}
          {data.personal_info?.phone && <span style={s.contactItem}><Phone size={12} /> {data.personal_info.phone}</span>}
          {data.personal_info?.location && <span style={s.contactItem}><MapPin size={12} /> {data.personal_info.location}</span>}
          {data.personal_info?.linkedin && <span style={s.contactItem}><Linkedin size={12} /> {data.personal_info.linkedin}</span>}
          {data.personal_info?.website && <span style={s.contactItem}><Globe size={12} /> {data.personal_info.website}</span>}
        </div>
      </header>
      <main>
        {sections.map(renderSection)}
      </main>
    </div>
  );
};

export default React.memo(ProfessionalTemplate);
