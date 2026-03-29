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

const CompactOneTemplate = ({
  data,
  accentColor = "#111827",
  sectionTypographies = {},
  leftSectionOrder,
  rightSectionOrder,
}) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultLeft = useMemo(
    () => ["contact", "technical_skills", "soft_skills", "languages"],
    []
  );
  const defaultRight = useMemo(
    () => [
      "about",
      "experience",
      "education",
      "projects",
      "participations",
      "achievements",
    ],
    []
  );

  const customKeys = useMemo(
    () => data?.custom_sections?.map((_, i) => `custom_${i}`) || [],
    [data?.custom_sections]
  );

  const [leftSections, setLeftSections] = useState(leftSectionOrder || defaultLeft);
  const [rightSections, setRightSections] = useState(
    rightSectionOrder || [...defaultRight, ...customKeys]
  );

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = { header: { fontFamily: "'Inter', sans-serif", fontSize: 11, lineHeight: 1.4 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "1.5rem 2rem", background: "#fff", color: "#111827", fontFamily: t.fontFamily },
      header: { marginBottom: "1rem", borderBottom: `2px solid ${accentColor}`, paddingBottom: "0.5rem" },
      name: { fontSize: baseFontSize * 2.5, fontWeight: "800", textTransform: "uppercase", letterSpacing: "-0.5px", color: accentColor, lineHeight: 1.1 },
      profession: { fontSize: baseFontSize * 1.2, fontWeight: "500", color: "#4B5563" },
      columns: { display: "flex", gap: "1.5rem" },
      leftCol: { width: "25%" },
      rightCol: { width: "75%", borderLeft: "1px solid #E5E7EB", paddingLeft: "1.5rem" },
      section: { marginBottom: "1rem" },
      h2: { fontSize: baseFontSize * 1.15, fontWeight: "700", textTransform: "uppercase", marginBottom: "0.5rem", letterSpacing: "1px" },
      textSm: { fontSize: baseFontSize * 0.9 },
      textXs: { fontSize: baseFontSize * 0.8, color: "#4B5563" },
      contactItem: { marginBottom: "0.5rem", fontSize: baseFontSize * 0.9 },
      item: { marginBottom: "0.75rem" },
      titleLeft: { fontWeight: "700", marginBottom: "2px" },
      titleRight: { fontWeight: "600" },
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const s = styles(key);
    const withSortable = (content) => (
      <SortableItem key={key} index={index} total={list.length} onMoveUp={() => move(list, setList, index, "up")} onMoveDown={() => move(list, setList, index, "down")}>
        {content}
      </SortableItem>
    );

    switch (key) {
      case "contact":
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Contact</h2>
            {data.personal_info?.phone && <div style={s.contactItem}><div style={s.titleLeft}>Phone</div><div>{data.personal_info.phone}</div></div>}
            {data.personal_info?.email && <div style={s.contactItem}><div style={s.titleLeft}>Email</div><div style={{wordBreak: "break-all"}}>{data.personal_info.email}</div></div>}
            {data.personal_info?.location && <div style={s.contactItem}><div style={s.titleLeft}>Location</div><div>{data.personal_info.location}</div></div>}
            {data.personal_info?.linkedin && <div style={s.contactItem}><div style={s.titleLeft}>LinkedIn</div><div style={{wordBreak: "break-all"}}>{data.personal_info.linkedin}</div></div>}
            {data.personal_info?.website && <div style={s.contactItem}><div style={s.titleLeft}>Portfolio</div><div style={{wordBreak: "break-all"}}>{data.personal_info.website}</div></div>}
          </section>
        );
      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Technical Skills</h2>
            <div style={s.textSm}>{data.skills.technicalSkills.join(", ")}</div>
          </section>
        );
      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Soft Skills</h2>
            <div style={s.textSm}>{data.skills.softSkills.join(", ")}</div>
          </section>
        );
      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Languages</h2>
            {data.languages.map((l, i) => <div key={i} style={s.textSm}>{l.language} <span style={s.textXs}>({l.proficiency})</span></div>)}
          </section>
        );
      case "about":
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
                <div style={s.titleRight}>{exp.position}</div>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "2px"}}>
                  <span style={{fontSize: s.textSm.fontSize, color: "#374151"}}>{exp.company}</span>
                  <span style={s.textXs}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
                </div>
                <div style={{...s.textSm, marginTop: "2px"}}>{exp.description}</div>
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
                <div style={s.titleRight}>{edu.degree}</div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span style={s.textSm}>{edu.institution}</span>
                  <span style={s.textXs}>{edu.graduation_date}</span>
                </div>
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
                <div style={s.titleRight}>{proj.name}</div>
                <div style={s.textSm}>{proj.description}</div>
              </div>
            ))}
          </section>
        );
      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Participations</h2>
            {data.participations.map((p, i) => (
              <div key={i} style={s.item}>
                <div style={s.titleRight}>{p.title}</div>
                {p.organization && <div style={s.textSm}>{p.organization}</div>}
                {p.description && <div style={s.textSm}>{p.description}</div>}
              </div>
            ))}
          </section>
        );
      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Achievements</h2>
            {data.achievements.map((a, i) => (
              <div key={i} style={s.item}>
                <div style={s.titleRight}>{a.title}</div>
                {a.description && <div style={s.textSm}>{a.description}</div>}
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
                  <div style={s.titleRight}>{item.title}</div>
                  {item.description && <div style={s.textSm}>{item.description}</div>}
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
      </header>
      <div style={h.columns}>
        <aside style={h.leftCol}>{leftSections.map((key, i) => renderSection(key, i, "left"))}</aside>
        <main style={h.rightCol}>{rightSections.map((key, i) => renderSection(key, i, "right"))}</main>
      </div>
    </div>
  );
};

export default React.memo(CompactOneTemplate);