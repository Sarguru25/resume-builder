import React, { useState, useMemo } from "react";
import { GripVertical } from "lucide-react";

/* =========================
   Sortable Item
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
          top: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          opacity: hover ? 1 : 0,
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
};

/* =========================
   Template
========================= */
const ClassicProTemplate = ({
  data,
  accentColor = "#000000",
  sectionTypographies = {},
  leftSectionOrder,
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultOrder = useMemo(
    () => [
      "about",
      "experience",
      "education",
      "projects",
      "technical_skills",
      "soft_skills",
      "languages",
      "certifications",
      "awards",
      "participations",   // ✅ added
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
      fontFamily: "'Times New Roman', serif",
      fontSize: 13,
      lineHeight: 1.6,
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
        padding: "2.5rem 3rem",
        background: "#fff",
        color: "#000",
        fontFamily: t.fontFamily,
        textAlign: "justify",
      },
      section: { marginBottom: "1.25rem" },
      h2: {
        fontSize: baseFontSize * 1.2,
        fontWeight: "bold",
        borderBottom: "1px solid #000",
        textTransform: "uppercase",
        marginBottom: "0.5rem",
      },
      textSm: { fontSize: baseFontSize * 0.9 },
      textXs: { fontSize: baseFontSize * 0.8, color: "#444" },
      between: { display: "flex", justifyContent: "space-between" },
      header: { textAlign: "center", marginBottom: "2rem" },
      name: {
        fontSize: baseFontSize * 2.5,
        fontWeight: "bold",
        marginBottom: "0.25rem",
      },
      profession: {
        fontSize: baseFontSize * 1.1,
        marginBottom: "0.5rem",
      },
      contactRow: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
      },
      item: { marginBottom: "0.75rem" },
    };
  };

  const renderSection = (key, index) => {
    const s = styles(key);

    const wrap = (content) => (
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
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>ABOUT ME</h2>
            <p style={s.textSm}>{data.professional_summary}</p>
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={s.between}>
                  <strong>{exp.position} - {exp.company}</strong>
                  <span>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
                </div>
                <p style={s.textSm}>{exp.description}</p>
              </div>
            ))}
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>EDUCATION</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={s.item}>
                <div style={s.between}>
                  <strong>{edu.degree} {edu.field && `in ${edu.field}`}</strong>
                  <span>{edu.graduation_date}</span>
                </div>
                <div>{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>PROJECTS</h2>
            {data.projects.map((proj, i) => (
              <div key={i}>
                <strong>{proj.name}</strong>
                <p style={s.textSm}>{proj.description}</p>
              </div>
            ))}
          </section>
        );

      case "participations": // ✅ added
        if (!hasItems(data.participations)) return null;
        return wrap(
          <section style={s.section}>
            <h2 style={s.h2}>PARTICIPATIONS</h2>
            {data.participations.map((p, i) => (
              <div key={i} style={s.item}>
                <strong>{p.title}</strong>
                {p.organization && <div>{p.organization}</div>}
                {p.description && <p style={s.textSm}>{p.description}</p>}
              </div>
            ))}
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return wrap(
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
        // ✅ CUSTOM SECTIONS SUPPORT
        if (key.startsWith("custom_")) {
          const idx = Number(key.split("_")[1]);
          const cs = data.custom_sections?.[idx];
          if (!cs || !hasItems(cs.items)) return null;

          return wrap(
            <section style={s.section}>
              <h2 style={s.h2}>{cs.section_title}</h2>
              {cs.items.map((item, i) => (
                <div key={i} style={s.item}>
                  <strong>{item.title}</strong>
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

  const contactParts = [
    data.personal_info?.phone,
    data.personal_info?.email,
    data.personal_info?.location,
    data.personal_info?.linkedin,
    data.personal_info?.website,
  ].filter(Boolean);

  return (
    <div style={h.page}>
      <header style={h.header}>
        <div style={h.name}>{data.personal_info?.full_name}</div>
        {data.personal_info?.profession && (
          <div style={h.profession}>{data.personal_info.profession}</div>
        )}

        <div style={h.contactRow}>
          {contactParts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>|</span>}
              <span>{part}</span>
            </React.Fragment>
          ))}
        </div>
      </header>

      <div>{sections.map((key, i) => renderSection(key, i))}</div>
    </div>
  );
};

export default React.memo(ClassicProTemplate);