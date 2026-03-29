import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

const SortableItem = ({ index, total, onMoveUp, onMoveDown, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{
        position: "absolute", left: "-28px", top: "4px", display: "flex", flexDirection: "column", gap: "4px",
        opacity: hover ? 1 : 0, transition: "opacity 0.2s", zIndex: 10
      }} className="print:hidden">
        <GripVertical size={14} color="#9ca3af" />
        {index > 0 && <button onClick={onMoveUp} style={btnStyle}>↑</button>}
        {index < total - 1 && <button onClick={onMoveDown} style={btnStyle}>↓</button>}
      </div>
      {children}
    </div>
  );
};

const btnStyle = {
  border: "none", background: "#e5e7eb", borderRadius: "4px", fontSize: "10px", cursor: "pointer",
  padding: "2px 4px", lineHeight: 1
};

const ModernEdgeTemplate = ({
  data,
  accentColor = "#4A6273",
  sectionTypographies = {},
  leftSectionOrder,
  rightSectionOrder
}) => {

  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  const defaultLeft = useMemo(() => ["contact", "technical_skills", "soft_skills", "education", "languages"], []);
  const defaultRight = useMemo(() => ["about", "experience", "projects", "certifications", "awards", "participations", "achievements"], []);

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

  const baseTypography = { header: { fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.5 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const getStyles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", display: "flex", background: "#fff", color: "#333", fontFamily: t.fontFamily },
      leftCol: { width: "32%", background: "#F1F5F9", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" },
      rightCol: { width: "68%", padding: "2rem" },
      headerRight: { paddingBottom: "1.5rem", borderBottom: `2px solid #E2E8F0`, marginBottom: "1.5rem" },
      name: { fontSize: baseFontSize * 2.2, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.5px", textTransform: "uppercase" },
      profession: { fontSize: baseFontSize * 1.1, color: accentColor, fontWeight: 600, marginTop: "0.25rem" },
      imgContainer: { width: "100%", aspectRatio: "1", backgroundColor: accentColor, marginBottom: "1rem", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "2rem", fontWeight: "bold" },
      section: { marginBottom: "1.25rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2: { fontSize: baseFontSize * 1.1, fontWeight: 700, color: accentColor, marginBottom: "0.75rem", letterSpacing: "1px", textTransform: "uppercase" },
      textSm: { fontSize: baseFontSize * 0.9, color: "#334155" },
      textXs: { fontSize: baseFontSize * 0.8, color: "#64748B" },
      between: { display: "flex", justifyContent: "space-between", alignItems: "baseline" },
      contactItem: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontSize: baseFontSize * 0.85 },
      item: { marginBottom: "1rem" },
      skillBadge: { background: "#E2E8F0", padding: "4px 8px", borderRadius: "16px", fontSize: "10px", margin: "2px", display: "inline-block", fontWeight: 500, color: "#334155" }
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const typographyKey = key === "technical_skills" || key === "soft_skills" ? "skills" : (key === "about" ? "professional_summary" : key);
    const s = getStyles(typographyKey);

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
            {data.personal_info?.phone && <div style={s.contactItem}><Phone size={14} color={accentColor} /> {data.personal_info.phone}</div>}
            {data.personal_info?.email && <div style={s.contactItem}><Mail size={14} color={accentColor} /> {data.personal_info.email}</div>}
            {data.personal_info?.location && <div style={s.contactItem}><MapPin size={14} color={accentColor} /> {data.personal_info.location}</div>}
            {data.personal_info?.linkedin && <div style={s.contactItem}><Linkedin size={14} color={accentColor} /> {data.personal_info.linkedin}</div>}
            {data.personal_info?.website && <div style={s.contactItem}><Globe size={14} color={accentColor} /> {data.personal_info.website}</div>}
          </section>
        );

      case "about":
        if (!data.professional_summary) return null;
        return withSortable(<section style={s.section}><h2 style={s.h2}>Summary</h2><p style={s.textSm}>{data.professional_summary}</p></section>);

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Technical Skills</h2>
            <div>{data.skills.technicalSkills.map((sk, i) => <span key={i} style={s.skillBadge}>{sk}</span>)}</div>
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Soft Skills</h2>
            <div>{data.skills.softSkills.map((sk, i) => <span key={i} style={s.skillBadge}>{sk}</span>)}</div>
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Languages</h2>
            {data.languages.map((l, i) => (
              <div key={i} style={{ marginBottom: "4px", fontSize: s.textSm.fontSize }}>
                {l.language} {l.proficiency && `(${l.proficiency})`}
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
                <div style={{ fontWeight: "600", fontSize: s.textSm.fontSize }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                <div style={s.textXs}>{edu.institution}</div>
                <div style={s.textXs}>{edu.graduation_date}</div>
                {edu.gpa && <div style={s.textXs}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={s.between}>
                  <strong style={{ fontSize: s.textSm.fontSize, color: "#1E293B" }}>{exp.position}</strong>
                  <span style={s.textXs}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
                </div>
                <div style={{ color: accentColor, fontWeight: "500", marginBottom: "4px", fontSize: s.textSm.fontSize }}>{exp.company}</div>
                {exp.description && <p style={s.textSm}>{exp.description}</p>}
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
                <div style={{ fontWeight: "600", fontSize: s.textSm.fontSize }}>{proj.name} {proj.type && `| ${proj.type}`}</div>
                {proj.description && <p style={s.textSm}>{proj.description}</p>}
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
                <div style={{ fontWeight: "600", fontSize: s.textSm.fontSize }}>{ach.title}</div>
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
            {data.participations.map((p, i) => (
              <div key={i} style={s.item}>
                <div style={{ fontWeight: "600", fontSize: s.textSm.fontSize }}>{p.title}</div>
                {p.organization && <div style={{ fontSize: s.textXs, color: "#64748B" }}>{p.organization}</div>}
                {p.description && <p style={s.textSm}>{p.description}</p>}
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
                  <div style={{ fontWeight: "600", fontSize: s.textSm.fontSize }}>{item.title}</div>
                  {item.description && <p style={s.textSm}>{item.description}</p>}
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
      <aside style={h.leftCol}>
        <div style={h.imgContainer}>{data.personal_info?.full_name?.charAt(0) || "M"}</div>
        {leftSections.map((key, i) => renderSection(key, i, "left"))}
      </aside>
      <main style={h.rightCol}>
        <header style={h.headerRight}>
          <div style={h.name}>{data.personal_info?.full_name}</div>
          {data.personal_info?.profession && <div style={h.profession}>{data.personal_info.profession}</div>}
        </header>
        <div>{rightSections.map((key, i) => renderSection(key, i, "right"))}</div>
      </main>
    </div>
  );
};

export default React.memo(ModernEdgeTemplate);