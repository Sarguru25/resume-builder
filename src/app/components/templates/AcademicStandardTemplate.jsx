import React, { useState, useMemo } from "react";
import { GripVertical } from "lucide-react";

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
        {index > 0 && (
          <button onClick={onMoveUp} style={btnStyle}>↑</button>
        )}
        {index < total - 1 && (
          <button onClick={onMoveDown} style={btnStyle}>↓</button>
        )}
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

const AcademicStandardTemplate = ({
  data,
  accentColor = "#000000",
  sectionTypographies = {},
  leftSectionOrder,
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultOrder = useMemo(
    () => [
      "about",
      "education",
      "experience",
      "projects",
      "certifications",
      "awards",
      "technical_skills",
      "soft_skills",
      "languages",
      "participations",
      "achievements",
    ],
    []
  );

  const customKeys = useMemo(
    () => data?.custom_sections?.map((_, i) => `custom_${i}`) || [],
    [data?.custom_sections]
  );

  const [sections, setSections] = useState(
    leftSectionOrder || [...defaultOrder, ...customKeys]
  );

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = {
    header: {
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: 13,
      lineHeight: 1.4,
    },
  };

  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;

    return {
      page: {
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        padding: "2rem 3rem",
        background: "#fff",
        color: "#000",
        fontFamily: t.fontFamily,
      },
      section: { marginBottom: "1rem" },
      h2: {
        fontSize: baseFontSize * 1.1,
        fontWeight: "bold",
        borderBottom: "1px solid #000",
        marginBottom: "0.5rem",
        textTransform: "uppercase",
      },
      textSm: { fontSize: baseFontSize * 0.95 },
      textXs: { fontSize: baseFontSize * 0.85, color: "#333" },
      between: { display: "flex", justifyContent: "space-between" },
      header: { textAlign: "center", marginBottom: "1.5rem" },
      name: {
        fontSize: baseFontSize * 2,
        fontWeight: "bold",
        textTransform: "uppercase",
      },
      profession: { fontSize: baseFontSize * 1.1 },
      contactRow: {
        fontSize: baseFontSize * 0.9,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      },
      item: { marginBottom: "0.75rem" },
    };
  };

  const renderSection = (key, index) => {
    const s = styles(key);

    const withSortable = (content) => (
      <SortableItem
        key={key}
        index={index}
        total={sections.length}
        onMoveUp={() => move(sections, setSections, index, "up")}
        onMoveDown={() => move(sections, setSections, index, "down")}
      >
        {content}
      </SortableItem>
    );

    switch (key) {
      case "about":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>ABOUT ME</h2>
            <p style={s.textSm}>{data.professional_summary}</p>
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>EDUCATION</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={s.item}>
                <div style={s.between}>
                  <strong>{edu.institution}</strong>
                  <span>{edu.graduation_date}</span>
                </div>
                <div style={s.between}>
                  <span>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>ACADEMIC & PROFESSIONAL APPOINTMENTS</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={s.between}>
                  <strong>{exp.position}, {exp.company}</strong>
                  <span>
                    {exp.start_date} –{" "}
                    {exp.is_current ? "Present" : exp.end_date}
                  </span>
                </div>
                {exp.description && (
                  <ul style={{ marginLeft: "1.5rem" }}>
                    <li>{exp.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>SELECTED PUBLICATIONS / PROJECTS</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={s.item}>
                <strong>{proj.name}</strong>
                {proj.description && <p>{proj.description}</p>}
              </div>
            ))}
          </section>
        );

      case "certifications":
        const certs = data.custom_sections?.[0]?.items || [];
        if (!hasItems(certs)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>CERTIFICATIONS</h2>
            {certs.map((c, i) => (
              <div key={i} style={s.item}>
                <strong>{c.title}</strong>
                {c.description && <p>{c.description}</p>}
              </div>
            ))}
          </section>
        );

      case "awards":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>AWARDS</h2>
            {data.achievements.map((a, i) => (
              <div key={i} style={s.item}>
                <strong>{a.title}</strong>
                {a.year && <div>{a.year}</div>}
                {a.description && <p>{a.description}</p>}
              </div>
            ))}
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>TECHNICAL SKILLS</h2>
            <div>{data.skills.technicalSkills.join(", ")}</div>
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>SOFT SKILLS</h2>
            <div>{data.skills.softSkills.join(", ")}</div>
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>LANGUAGES</h2>
            {data.languages.map((l, i) => (
              <div key={i}>
                {l.language} {l.proficiency && `(${l.proficiency})`}
              </div>
            ))}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>PARTICIPATIONS</h2>
            {data.participations.map((p, i) => (
              <div key={i}>
                <strong>{p.title}</strong>
                {p.organization && <div>{p.organization}</div>}
              </div>
            ))}
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>ACHIEVEMENTS</h2>
            {data.achievements.map((a, i) => (
              <div key={i}>
                <strong>{a.title}</strong>
                {a.description && <p>{a.description}</p>}
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
                <div key={i}>
                  <strong>{item.title}</strong>
                  {item.description && <p>{item.description}</p>}
                </div>
              ))}
            </section>
          );
        }
        return null;
    }
  };

  const h = styles("header");

  const addressParts = [
    data.personal_info?.email,
    data.personal_info?.phone,
    data.personal_info?.location,
    data.personal_info?.website,
  ].filter(Boolean);

  return (
    <div style={h.page}>
      <header style={h.header}>
        <div style={h.name}>{data.personal_info?.full_name}</div>
        {data.personal_info?.profession && (
          <div style={h.profession}>
            {data.personal_info.profession}
          </div>
        )}

        <div style={h.contactRow}>
          {addressParts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ margin: "0 0.5rem" }}>|</span>}
              <span>{part}</span>
            </React.Fragment>
          ))}
        </div>
      </header>

      <div>{sections.map((key, i) => renderSection(key, i))}</div>
    </div>
  );
};

export default React.memo(AcademicStandardTemplate);