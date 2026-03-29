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

const CreativeTemplate = ({
  data,
  accentColor = "#8b5cf6",
  sectionTypographies = {},
  leftSectionOrder,
  rightSectionOrder,
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultLeft = useMemo(() => ["contact", "education", "technical_skills", "soft_skills", "languages"], []);
  const customKeys = useMemo(() => data?.custom_sections?.map((_, i) => `custom_${i}`) || [], [data?.custom_sections]);
  const defaultRight = useMemo(() => ["professional_summary", "experience", "projects", "participations", "achievements", ...customKeys], [customKeys]);

  const [leftSections, setLeftSections] = useState(leftSectionOrder || defaultLeft);
  const [rightSections, setRightSections] = useState(rightSectionOrder || defaultRight);

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = {
    header: { fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.5 },
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
        background: "#fff",
        color: "#334155",
        fontFamily: t.fontFamily,
        display: "flex",
        flexDirection: "column"
      },
      header: {
        backgroundColor: accentColor,
        color: "#fff",
        padding: "2.5rem 3rem",
        textAlign: "left",
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
        marginBottom: "1rem"
      },
      name: {
        fontSize: baseFontSize * 2.2,
        fontWeight: 800,
        marginBottom: "0.25rem",
        letterSpacing: "1px"
      },
      profession: {
        fontSize: baseFontSize * 1.1,
        fontWeight: 500,
        opacity: 0.9,
      },
      columns: {
        display: "flex",
        flex: 1,
        padding: "0 3rem 2rem 3rem",
        gap: "2.5rem"
      },
      left: {
        width: "35%",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      },
      right: {
        width: "65%",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      },
      section: {
        fontSize: baseFontSize,
        lineHeight: t.lineHeight,
        fontFamily: t.fontFamily,
      },
      h2: {
        fontSize: baseFontSize * 1.15,
        fontWeight: 700,
        color: accentColor,
        borderBottom: `2px dashed ${accentColor}50`,
        paddingBottom: "0.25rem",
        marginBottom: "1rem",
        textTransform: "uppercase",
        letterSpacing: "1px"
      },
      contactItem: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.75rem",
        fontSize: baseFontSize * 0.9,
        fontWeight: 500,
        color: "#475569"
      },
      iconBox: {
        backgroundColor: `${accentColor}20`,
        color: accentColor,
        padding: "0.35rem",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      item: {
        marginBottom: "1rem",
      },
      title: {
        fontWeight: 700,
        color: "#1e293b",
        fontSize: baseFontSize * 1.05,
      },
      subtitle: {
        fontWeight: 500,
        color: accentColor,
        fontSize: baseFontSize * 0.95,
        marginBottom: "0.25rem"
      },
      date: {
        fontSize: baseFontSize * 0.8,
        color: "#64748b",
        fontWeight: 600,
        backgroundColor: "#f1f5f9",
        padding: "0.15rem 0.5rem",
        borderRadius: "12px",
        display: "inline-block",
        marginBottom: "0.25rem"
      },
      textBody: {
        fontSize: baseFontSize * 0.9,
        color: "#475569",
        lineHeight: 1.6
        
      },
      skillPill: {
        display: "inline-block",
        padding: "0.35rem 0.75rem",
        background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}30 100%)`,
        color: accentColor,
        borderRadius: "20px",
        fontSize: baseFontSize * 0.85,
        fontWeight: 600,
        marginRight: "0.5rem",
        marginBottom: "0.5rem"
      }
    };
  };

  const renderLeft = (key, index) => {
    const s = getStyles(key);
    const withSortable = (content) => (
      <SortableItem key={key} index={index} total={leftSections.length} onMoveUp={() => move(leftSections, setLeftSections, index, "up")} onMoveDown={() => move(leftSections, setLeftSections, index, "down")}>
        {content}
      </SortableItem>
    );

    switch (key) {
      case "contact":
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Contact Details</h2>
            {data.personal_info?.email && (
              <div style={s.contactItem}><div style={s.iconBox}><Mail size={14} /></div>{data.personal_info.email}</div>
            )}
            {data.personal_info?.phone && (
              <div style={s.contactItem}><div style={s.iconBox}><Phone size={14} /></div>{data.personal_info.phone}</div>
            )}
            {data.personal_info?.location && (
              <div style={s.contactItem}><div style={s.iconBox}><MapPin size={14} /></div>{data.personal_info.location}</div>
            )}
            {data.personal_info?.linkedin && (
              <div style={s.contactItem}><div style={s.iconBox}><Linkedin size={14} /></div>{data.personal_info.linkedin}</div>
            )}
            {data.personal_info?.website && (
              <div style={s.contactItem}><div style={s.iconBox}><Globe size={14} /></div>{data.personal_info.website}</div>
            )}
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Tech Skills</h2>
            <div>
              {data.skills.technicalSkills.map((skill, i) => (
                <span key={i} style={s.skillPill}>{skill}</span>
              ))}
            </div>
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Soft Skills</h2>
            <div>
              {data.skills.softSkills.map((skill, i) => (
                <span key={i} style={s.skillPill}>{skill}</span>
              ))}
            </div>
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Languages</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {data.languages.map((lang, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: s.textBody.fontSize }}>{lang.language}</span>
                  {lang.proficiency && <span style={{ fontSize: s.textBody.fontSize * 0.9, color: s.textBody.color }}>{lang.proficiency}</span>}
                </div>
              ))}
            </div>
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={s.item}>
                <div style={s.title}>{edu.degree}</div>
                <div style={s.subtitle}>{edu.institution}</div>
                <div style={s.date}>{edu.graduation_date}</div>
                {edu.gpa && <div style={s.textBody}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        );

      default: return null;
    }
  };

  const renderRight = (key, index) => {
    const s = getStyles(key);
    const withSortable = (content) => (
      <SortableItem key={key} index={index} total={rightSections.length} onMoveUp={() => move(rightSections, setRightSections, index, "up")} onMoveDown={() => move(rightSections, setRightSections, index, "down")}>
        {content}
      </SortableItem>
    );

    switch (key) {
      case "professional_summary":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>About Me</h2>
            <p style={s.textBody}>{data.professional_summary}</p>
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <div style={s.title}>{exp.position}</div>
                  <div style={s.date}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                </div>
                <div style={s.subtitle}>{exp.company}</div>
                {exp.description && <div style={{...s.textBody, whiteSpace: "pre-wrap"}}>{exp.description}</div>}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <div style={s.title}>{proj.name}</div>
                  {proj.type && <div style={s.date}>{proj.type}</div>}
                </div>
                {proj.description && <div style={s.textBody}>{proj.description}</div>}
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
                <div style={s.title}>{part.title}</div>
                {part.organization && <div style={s.subtitle}>{part.organization}</div>}
                {part.description && <div style={s.textBody}>{part.description}</div>}
              </div>
            ))}
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Achievements</h2>
            {data.achievements.map((ach, i) => (
              <div key={i} style={s.item}>
                <div style={s.title}>{ach.title}</div>
                {ach.description && <div style={s.textBody}>{ach.description}</div>}
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
                  <div style={s.title}>{item.title}</div>
                  {item.description && <div style={s.textBody}>{item.description}</div>}
                </div>
              ))}
            </section>
          );
        }
        return null;
    }
  };

  const h = getStyles("header");

  return (
    <div style={h.page}>
      <header style={h.header}>
        <div style={h.name}>{data.personal_info?.full_name}</div>
        <div style={h.profession}>{data.personal_info?.profession}</div>
      </header>
      <div style={h.columns}>
        <aside style={h.left}>
          {leftSections.map(renderLeft)}
        </aside>
        <main style={h.right}>
          {rightSections.map(renderRight)}
        </main>
      </div>
    </div>
  );
};

export default React.memo(CreativeTemplate);
