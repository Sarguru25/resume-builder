import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

// Sortable wrapper for moving sections up/down
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

const btnStyle = { border: "none", background: "#e5e7eb", borderRadius: "4px", fontSize: "10px", cursor: "pointer", padding: "2px 4px", lineHeight: 1 };

const CorporateStandardTemplate = ({ data, accentColor = "#1E3A8A", sectionTypographies = {}, leftSectionOrder, rightSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  // Default sections
  const defaultLeft = useMemo(() => ["technical_skills", "soft_skills", "languages", "certifications"], []);
  const defaultRight = useMemo(() => ["about", "experience", "education", "projects", "achievements", "participations"], []);

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

  const baseTypography = { header: { fontFamily: "'Arial', 'Helvetica', sans-serif", fontSize: 13, lineHeight: 1.5 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", background: "#fff", color: "#333", fontFamily: t.fontFamily, display: "flex", flexDirection: "column" },
      header: { background: "#F8FAFC", padding: "2.5rem 3rem", borderBottom: `4px solid ${accentColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
      name: { fontSize: baseFontSize * 2.4, fontWeight: "bold", color: "#0F172A", marginBottom: "0.25rem" },
      profession: { fontSize: baseFontSize * 1.2, fontWeight: "600", color: accentColor },
      contactList: { display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: baseFontSize * 0.85, textAlign: "right" },
      main: { display: "flex", flex: 1 },
      leftCol: { width: "32%", background: "#F1F5F9", padding: "2rem", borderRight: "1px solid #E2E8F0" },
      rightCol: { width: "68%", padding: "2rem" },
      sectionLeft: { marginBottom: "1.5rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      sectionRight: { marginBottom: "1.5rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2Left: { fontSize: baseFontSize * 1.1, fontWeight: "bold", color: "#1E293B", textTransform: "uppercase", marginBottom: "0.75rem", borderBottom: "2px solid #CBD5E1", paddingBottom: "0.25rem" },
      h2Right: { fontSize: baseFontSize * 1.2, fontWeight: "bold", color: accentColor, textTransform: "uppercase", marginBottom: "1rem", borderBottom: `1px solid ${accentColor}`, paddingBottom: "0.25rem" },
      textSm: { fontSize: baseFontSize * 0.95 },
      textXs: { fontSize: baseFontSize * 0.85, color: "#64748B" },
      itemRight: { marginBottom: "1.25rem" },
      titleRight: { fontWeight: "bold", fontSize: "1.05em", color: "#0F172A" },
      company: { fontWeight: "600", color: "#334155" },
      listLi: { marginBottom: "0.25rem", color: "#334155" }
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const s = styles(key);
    const withSortable = (content) => <SortableItem key={key} index={index} total={list.length} onMoveUp={() => move(list, setList, index, "up")} onMoveDown={() => move(list, setList, index, "down")}>{content}</SortableItem>;

    if (side === "left") {
      switch (key) {
        case "technical_skills":
          if (!hasItems(data.skills?.technicalSkills)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Technical Skills</h2>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: s.textSm.fontSize }}>
                {data.skills.technicalSkills.map((sk, i) => <li key={i} style={{ marginBottom: "4px" }}>{sk}</li>)}
              </ul>
            </section>
          );
        case "soft_skills":
          if (!hasItems(data.skills?.softSkills)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Soft Skills</h2>
              <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: s.textSm.fontSize }}>
                {data.skills.softSkills.map((sk, i) => <li key={i} style={{ marginBottom: "4px" }}>{sk}</li>)}
              </ul>
            </section>
          );
        case "languages":
          if (!hasItems(data.languages)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Languages</h2>
              {data.languages.map((l, i) => <div key={i} style={{ fontSize: s.textSm.fontSize, marginBottom: "4px" }}><strong>{l.language}</strong>: {l.proficiency}</div>)}
            </section>
          );
        case "certifications":
          if (!hasItems(data.certifications)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Certifications</h2>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ fontSize: s.textSm.fontSize, marginBottom: "8px" }}>
                  <div style={{ fontWeight: "bold" }}>{c.name}</div>
                  <div style={s.textXs}>{c.issuer}</div>
                </div>
              ))}
            </section>
          );
        default: return null;
      }
    } else {
      switch (key) {
        case "about":
          if (!data.professional_summary) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Executive Summary</h2>
              <p style={s.textSm}>{data.professional_summary}</p>
            </section>
          );
        case "experience":
          if (!hasItems(data.experience)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Professional Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={s.titleRight}>{exp.position}</div>
                    <div style={{ ...s.textSm, fontWeight: "bold" }}>{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                  </div>
                  <div style={{ ...s.textSm, ...s.company, marginBottom: "4px" }}>{exp.company}</div>
                  {Array.isArray(exp.description)
                    ? <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: s.textSm.fontSize }}>
                      {exp.description.map((d, idx) => <li key={idx} style={s.listLi}>{d}</li>)}
                    </ul>
                    : <p style={s.textSm}>{exp.description}</p>}
                </div>
              ))}
            </section>
          );
        case "education":
          if (!hasItems(data.education)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={s.titleRight}>{edu.degree}</div>
                    <div style={{ ...s.textSm, fontWeight: "bold" }}>{edu.graduation_date}</div>
                  </div>
                  <div style={{ ...s.textSm, ...s.company }}>{edu.institution}</div>
                </div>
              ))}
            </section>
          );
        case "projects":
          if (!hasItems(data.projects)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Key Projects</h2>
              {data.projects.map((proj, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.titleRight}>{proj.name}</div>
                  <p style={{ ...s.textSm, marginTop: "4px" }}>{proj.description}</p>
                </div>
              ))}
            </section>
          );
        case "achievements":
          if (!hasItems(data.achievements)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Achievements</h2>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: s.textSm.fontSize }}>
                {data.achievements.map((a, i) => (
                  <li key={i} style={s.listLi}>
                    {typeof a === "string"
                      ? a
                      : <><strong>{a.title}</strong> ({a.year}) {a.description}</>}
                  </li>
                ))}
              </ul>
            </section>
          );

        case "participations":
          if (!hasItems(data.participations)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Participations</h2>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: s.textSm.fontSize }}>
                {data.participations.map((p, i) => (
                  <li key={i} style={s.listLi}>
                    {typeof p === "string"
                      ? p
                      : <><strong>{p.title}</strong> ({p.year}) {p.description}</>}
                  </li>
                ))}
              </ul>
            </section>
          );
        default:
          // Custom sections
          if (key.startsWith("custom_")) {
            const idx = Number(key.split("_")[1]);
            const cs = data.custom_sections?.[idx];
            if (!cs) return null;
            return withSortable(
              <section style={s.sectionRight}>
                <h2 style={s.h2Right}>{cs.section_title}</h2>
                {cs.items.map((item, i) => (
                  <div key={i} style={s.itemRight}>
                    <div style={s.titleRight}>{item.title}</div>
                    {item.description && <p style={s.textSm}>{item.description}</p>}
                  </div>
                ))}
              </section>
            );
          }
          return null;
      }
    }
  };

  const h = styles("header");
  return (
    <div style={h.page}>
      <header style={h.header}>
        <div>
          <div style={h.name}>{data.personal_info?.full_name}</div>
          {data.personal_info?.profession && <div style={h.profession}>{data.personal_info.profession}</div>}
        </div>
        <div style={h.contactList}>
          {data.personal_info?.phone && <div><Phone size={14} style={{ marginRight: 4 }} />{data.personal_info.phone}</div>}
          {data.personal_info?.email && <div><Mail size={14} style={{ marginRight: 4 }} />{data.personal_info.email}</div>}
          {data.personal_info?.location && <div><MapPin size={14} style={{ marginRight: 4 }} />{data.personal_info.location}</div>}
          {data.personal_info?.linkedin && <div><Linkedin size={14} style={{ marginRight: 4 }} />{data.personal_info.linkedin}</div>}
          {data.personal_info?.website && <div><Globe size={14} style={{ marginRight: 4 }} />{data.personal_info.website}</div>}
        </div>
      </header>
      <div style={h.main}>
        <aside style={h.leftCol}>{leftSections.map((key, i) => renderSection(key, i, "left"))}</aside>
        <main style={h.rightCol}>{rightSections.map((key, i) => renderSection(key, i, "right"))}</main>
      </div>
    </div>
  );
};

export default React.memo(CorporateStandardTemplate);