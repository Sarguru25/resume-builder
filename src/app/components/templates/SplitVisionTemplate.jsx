import React, { useState, useMemo } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";

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

const SplitVisionTemplate = ({ data, accentColor = "#8B5CF6", sectionTypographies = {}, leftSectionOrder, rightSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;
  
  const defaultLeft = useMemo(() => ["contact", "skills", "education"], []);
  const defaultRight = useMemo(() => ["about", "experience", "projects", "certifications"], []); // Simplified keys for demo
  
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

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", display: "flex", fontFamily: t.fontFamily },
      leftCol: { width: "45%", background: accentColor, color: "#fff", padding: "3rem" },
      rightCol: { width: "55%", background: "#fff", color: "#111827", padding: "3rem" },
      headerLeft: { marginBottom: "3rem" },
      nameLeft: { fontSize: baseFontSize * 3.5, fontWeight: "900", textTransform: "uppercase", lineHeight: 1, letterSpacing: "-1px" },
      profLeft: { fontSize: baseFontSize * 1.2, fontWeight: "500", marginTop: "0.5rem", opacity: 0.9 },
      headerRight: { marginBottom: "3rem" },
      nameRight: { fontSize: baseFontSize * 2.5, fontWeight: "900", textTransform: "uppercase", lineHeight: 1, color: "#111827" },
      profRight: { fontSize: baseFontSize * 1.1, fontWeight: "600", marginTop: "0.5rem", color: "#6B7280", letterSpacing: "1px" },
      sectionLeft: { marginBottom: "2rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      sectionRight: { marginBottom: "2rem", fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2Left: { fontSize: baseFontSize * 1.3, fontWeight: "800", textTransform: "uppercase", marginBottom: "1rem" },
      h2Right: { fontSize: baseFontSize * 1.3, fontWeight: "800", textTransform: "uppercase", marginBottom: "1rem", color: "#111827", borderBottom: `2px solid ${accentColor}`, paddingBottom: "0.5rem" },
      textSm: { fontSize: baseFontSize * 0.95 },
      textXs: { fontSize: baseFontSize * 0.85, opacity: 0.8 },
      textXsRight: { fontSize: baseFontSize * 0.85, color: "#6B7280" },
      contactItem: { display: "flex", gap: "0.5rem", marginBottom: "0.75rem", fontSize: baseFontSize * 0.9, alignItems: "center" },
      itemRight: { marginBottom: "1.5rem" },
      titleRight: { fontWeight: "800", fontSize: "1.1em", color: "#111827" },
      subTitle: { fontWeight: "600", color: "#4B5563" }
    };
  };

  const renderSection = (key, index, side) => {
    const list = side === "left" ? leftSections : rightSections;
    const setList = side === "left" ? setLeftSections : setRightSections;
    const typographyKey = key === "skills" ? "skills" : (key === "about" ? "professional_summary" : key);
    const s = styles(typographyKey);
    const withSortable = (content) => <SortableItem key={key} index={index} total={list.length} onMoveUp={() => move(list, setList, index, "up")} onMoveDown={() => move(list, setList, index, "down")}>{content}</SortableItem>;

    if (side === "left") {
      switch (key) {
        case "contact":
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Contact Info</h2>
              {data.personal_info?.location && <div style={s.contactItem}><MapPin size={16} /> Location<br/>{data.personal_info.location}</div>}
              {data.personal_info?.phone && <div style={s.contactItem}><Phone size={16} /> Phone<br/>{data.personal_info.phone}</div>}
              {data.personal_info?.email && <div style={s.contactItem}><Mail size={16} /> Email<br/>{data.personal_info.email}</div>}
              {data.personal_info?.website && <div style={s.contactItem}><Globe size={16} /> Portfolio<br/>{data.personal_info.website}</div>}
              {data.personal_info?.linkedin && <div style={s.contactItem}><Linkedin size={16} /> LinkedIn<br/>{data.personal_info.linkedin}</div>}
            </section>
          );
        case "skills":
          if (!hasItems(data.skills?.technicalSkills) && !hasItems(data.skills?.softSkills)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Skills</h2>
              <div style={{fontSize: s.textSm.fontSize, lineHeight: 1.8}}>
                {data.skills?.technicalSkills?.join(", ")}
                {data.skills?.softSkills && data.skills.technicalSkills && ", "}
                {data.skills?.softSkills?.join(", ")}
              </div>
            </section>
          );
        case "education":
          if (!hasItems(data.education)) return null;
          return withSortable(
            <section style={s.sectionLeft}>
              <h2 style={s.h2Left}>Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} style={{marginBottom: "1rem"}}>
                  <div style={{fontWeight: "700", fontSize: s.textSm.fontSize}}>{edu.degree}</div>
                  <div style={{fontSize: s.textSm.fontSize, marginTop: "2px"}}>{edu.institution}</div>
                  <div style={s.textXs}>{edu.graduation_date}</div>
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
          return withSortable(<section style={s.sectionRight}><h2 style={s.h2Right}>Profile</h2><p style={s.textSm}>{data.professional_summary}</p></section>);
        case "experience":
          if (!hasItems(data.experience)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Work Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.titleRight}>{exp.position}</div>
                  <div style={{...s.textSm, ...s.subTitle, marginBottom: "4px"}}>{exp.company} | {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</div>
                  <p style={{...s.textSm, color: "#4B5563"}}>{exp.description}</p>
                </div>
              ))}
            </section>
          );
        case "projects":
          if (!hasItems(data.projects)) return null;
          return withSortable(
            <section style={s.sectionRight}>
              <h2 style={s.h2Right}>Projects</h2>
              {data.projects.map((proj, i) => (
                <div key={i} style={s.itemRight}>
                  <div style={s.titleRight}>{proj.name}</div>
                  <p style={{...s.textSm, color: "#4B5563", marginTop: "2px"}}>{proj.description}</p>
                </div>
              ))}
            </section>
          );
        default: return null;
      }
    }
  };

  const hl = styles("header");
  const parsedName = data.personal_info?.full_name?.split(" ") || ["Name"];
  const firstName = parsedName[0];
  const lastName = parsedName.slice(1).join(" ");

  return (
    <div style={hl.page}>
      <aside style={hl.leftCol}>
        <div style={hl.headerLeft}>
          <div style={hl.nameLeft}>{firstName}<br/>{lastName}</div>
          {data.personal_info?.profession && <div style={hl.profLeft}>{data.personal_info.profession}</div>}
        </div>
        {leftSections.map((key, i) => renderSection(key, i, "left"))}
      </aside>
      <main style={hl.rightCol}>
        <div style={hl.headerRight}>
          <div style={hl.nameRight}>SPLIT VISION</div>
          <div style={hl.profRight}>(RESUME TEMPLATE)</div>
        </div>
        {rightSections.map((key, i) => renderSection(key, i, "right"))}
      </main>
    </div>
  );
};

export default React.memo(SplitVisionTemplate);
