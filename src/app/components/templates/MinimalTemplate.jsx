import React, { useState, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  GripVertical,
} from "lucide-react";

/* =========================
   Sortable Wrapper (same as ModernTemplate)
========================= */
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
          top: "6px",
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

/* =========================
   Enhanced Minimal Template
========================= */
const MinimalTemplate = ({
  data,
  accentColor = "#2563eb",
  sectionTypographies = {},
  leftSectionOrder: propLeftOrder,   // optional override
  rightSectionOrder: propRightOrder, // optional override
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  // ----- Build initial section keys -----
  const defaultLeft = useMemo(
    () => [
      "contact",
      "technical_skills",
      "soft_skills",
      "languages",
    ],
    []
  );

  // Custom sections become individual keys (custom_0, custom_1, …)
  const customKeys = useMemo(
    () => data?.custom_sections?.map((_, i) => `custom_${i}`) || [],
    [data?.custom_sections]
  );

  const defaultRight = useMemo(
    () => [
      "professional_summary",
      "experience",
      "projects",
      "education",
      "achievements",
      "participations",
      ...customKeys,
    ],
    [customKeys]
  );

  const [leftSections, setLeftSections] = useState(propLeftOrder || defaultLeft);
  const [rightSections, setRightSections] = useState(propRightOrder || defaultRight);

  // Move section within a column
  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  // ----- Typography merging -----
  const baseTypography = {
    header: { fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.5 },
  };
  const merged = { ...baseTypography, ...sectionTypographies };

  const getStyles = (key) => {
    // For skills sections, use the "skills" typography key if available
    const effectiveKey =
      key === "technical_skills" || key === "soft_skills" ? "skills" : key;
    const t = { ...merged.header, ...merged[effectiveKey] };
    const baseFontSize = t.fontSize;

    return {
      page: {
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
        display: "flex",
        fontFamily: t.fontFamily,
        background: "#fff",
      },
      left: {
        width: "30%",
        padding: "1.5rem",
        background: "#f3f4f6",
      },
      right: {
        width: "70%",
        padding: "1.8rem",
      },
      h2: {
        fontSize: baseFontSize * 1,
        fontWeight: 600,
        color: accentColor,
        borderBottom: `1px solid ${accentColor}`,
        marginBottom: "0.5rem",
      },
      block: {
        marginBottom: "1rem",
        fontFamily: t.fontFamily,
        fontSize: baseFontSize,
        lineHeight: t.lineHeight,
      },
      textSm: { fontSize: baseFontSize * 0.875 },
      textXs: { fontSize: baseFontSize * 0.75, color: "#6b7280" },
      // Left accent border (applied to most items)
      borderL: {
        borderLeft: `2px solid ${accentColor}`,
        paddingLeft: "0.5rem",
        marginBottom: "0.6rem",
        paddingTop: "0.1rem",
        paddingBottom: "0.1rem",
      },
      name: {
        fontSize: baseFontSize * 1.85,
        fontWeight: "bold",
        color: accentColor,
        marginBottom: "1rem",
      },
      contactItem: {
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        marginBottom: "0.2rem",
        fontSize: baseFontSize * 0.875,
      },
    };
  };

  const styles = getStyles("header");

  // ----- Render left column sections -----
  const renderLeft = (key, index) => {
    const s = getStyles(key);
    const withSortable = (content) => (
      <SortableItem
        key={key}
        index={index}
        total={leftSections.length}
        onMoveUp={() => move(leftSections, setLeftSections, index, "up")}
        onMoveDown={() => move(leftSections, setLeftSections, index, "down")}
      >
        {content}
      </SortableItem>
    );

    switch (key) {
      case "contact":
        return withSortable(
          <section style={s.block}>
            <h2 style={s.h2}>CONTACT</h2>
            {data.personal_info?.email && (
              <div style={s.contactItem}>
                <Mail size={12} /> {data.personal_info.email}
              </div>
            )}
            {data.personal_info?.phone && (
              <div style={s.contactItem}>
                <Phone size={12} /> {data.personal_info.phone}
              </div>
            )}
            {data.personal_info?.location && (
              <div style={s.contactItem}>
                <MapPin size={12} /> {data.personal_info.location}
              </div>
            )}
            {data.personal_info?.linkedin && (
              <div style={s.contactItem}>
                <Linkedin size={12} /> {data.personal_info.linkedin}
              </div>
            )}
            {data.personal_info?.website && (
              <div style={s.contactItem}>
                <Globe size={12} /> {data.personal_info.website}
              </div>
            )}
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.block}>
            <h2 style={s.h2}>TECHNICAL SKILLS</h2>
            {data.skills.technicalSkills.map((skill, i) => (
              <div key={i} style={s.borderL}>
                <span style={s.textSm}>{skill}</span>
              </div>
            ))}
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.block}>
            <h2 style={s.h2}>SOFT SKILLS</h2>
            {data.skills.softSkills.map((skill, i) => (
              <div key={i} style={s.borderL}>
                <span style={s.textSm}>{skill}</span>
              </div>
            ))}
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.block}>
            <h2 style={s.h2}>LANGUAGES</h2>
            {data.languages.map((lang, i) => (
              <div key={i} style={s.borderL}>
                <span style={s.textSm}>
                  {lang.language} {lang.proficiency && `(${lang.proficiency})`}
                </span>
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  // ----- Render right column sections -----
  const renderRight = (key, index) => {
    const s = getStyles(key);
    const withSortable = (content) => (
      <SortableItem
        key={key}
        index={index}
        total={rightSections.length}
        onMoveUp={() => move(rightSections, setRightSections, index, "up")}
        onMoveDown={() => move(rightSections, setRightSections, index, "down")}
      >
        {content}
      </SortableItem>
    );

    switch (key) {
      case "professional_summary":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={styles.block}>
            <h2 style={styles.h2}>SUMMARY</h2>
            <p style={styles.textSm}>{data.professional_summary}</p>
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={styles.block}>
            <h2 style={styles.h2}>EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={styles.borderL}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{exp.position}</strong>
                  <span style={styles.textXs}>
                    {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}
                  </span>
                </div>
                <div style={styles.textXs}>{exp.company}</div>
                {exp.description && <p style={styles.textSm}>{exp.description}</p>}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={styles.block}>
            <h2 style={styles.h2}>PROJECTS</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={styles.borderL}>
                <strong>{proj.name}</strong>
                {proj.type && <div style={styles.textXs}>{proj.type}</div>}
                {proj.description && <p style={styles.textSm}>{proj.description}</p>}
              </div>
            ))}
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={styles.block}>
            <h2 style={styles.h2}>EDUCATION</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={styles.borderL}>
                <strong>
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </strong>
                <div style={styles.textXs}>{edu.institution}</div>
                {edu.gpa && <div style={styles.textXs}>GPA: {edu.gpa}</div>}
                {edu.graduation_date && (
                  <div style={styles.textXs}>{edu.graduation_date}</div>
                )}
              </div>
            ))}
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={styles.block}>
            <h2 style={styles.h2}>ACHIEVEMENTS</h2>
            {data.achievements.map((ach, i) => (
              <div key={i} style={styles.borderL}>
                <strong>{ach.title}</strong>
                {ach.description && <p style={styles.textSm}>{ach.description}</p>}
              </div>
            ))}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={styles.block}>
            <h2 style={styles.h2}>PARTICIPATIONS</h2>
            {data.participations.map((part, i) => (
              <div key={i} style={styles.borderL}>
                <strong>{part.title}</strong>
                {part.organization && (
                  <div style={styles.textXs}>{part.organization}</div>
                )}
                {part.description && <p style={styles.textSm}>{part.description}</p>}
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
            <section style={styles.block}>
              <h2 style={styles.h2}>{cs.section_title}</h2>
              {cs.items.map((item, i) => (
                <div key={i} style={styles.borderL}>
                  <strong>{item.title}</strong>
                  {item.description && <p style={styles.textSm}>{item.description}</p>}
                </div>
              ))}
            </section>
          );
        }
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <aside style={styles.left}>
        {/* Name is displayed at the top of the left column */}
        <div style={styles.name}>{data.personal_info?.full_name}</div>
        {leftSections.map(renderLeft)}
      </aside>

      <main style={styles.right}>
        {rightSections.map(renderRight)}
      </main>
    </div>
  );
};

export default React.memo(MinimalTemplate);