import React, { useState, useMemo } from "react";
import { GripVertical } from "lucide-react";

const SortableItem = ({ index, total, onMoveUp, onMoveDown, children }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative", marginBottom: "1.5rem" }}
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}>
      <div style={{
        position: "absolute",
        left: "-28px",
        top: "4px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        opacity: hover ? 1 : 0,
        transition: "opacity 0.2s"
      }} className="print:hidden">
        <GripVertical size={14} color="#00ff00" />
        {index > 0 && <button onClick={onMoveUp} style={btnStyle}>↑</button>}
        {index < total - 1 && <button onClick={onMoveDown} style={btnStyle}>↓</button>}
      </div>
      {children}
    </div>
  );
};
const btnStyle = { border: "none", background: "#333", color: "#00ff00", borderRadius: "2px", fontSize: "10px", cursor: "pointer", padding: "2px 4px", lineHeight: 1 };

const NeonDeveloperTemplate = ({ data, accentColor = "#00FF41", sectionTypographies = {}, leftSectionOrder }) => {
  const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

  // Section ordering
  const defaultOrder = useMemo(() => [
    "about", "experience", "education", "projects", "technical_skills",
    "soft_skills", "achievements", "participations", "languages"
  ], []);
  const customKeys = useMemo(() => data?.custom_sections?.map((_, i) => `custom_${i}`) || [], [data?.custom_sections]);
  const [sections, setSections] = useState(leftSectionOrder || [...defaultOrder, ...customKeys]);

  const move = (list, setList, index, dir) => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= list.length) return;
    const copy = [...list];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setList(copy);
  };

  const baseTypography = { header: { fontFamily: "'Fira Code', monospace", fontSize: 13, lineHeight: 1.6 } };
  const merged = { ...baseTypography, ...sectionTypographies };

  const styles = (key) => {
    const t = { ...merged.header, ...merged[key] };
    const baseFontSize = t.fontSize;
    return {
      page: { width: "210mm", minHeight: "297mm", boxSizing: "border-box", margin: "0 auto", padding: "3rem", background: "#0D1117", color: "#C9D1D9", fontFamily: t.fontFamily },
      section: { fontSize: baseFontSize, lineHeight: t.lineHeight },
      h2: { fontSize: baseFontSize * 1.2, fontWeight: "bold", color: accentColor, marginBottom: "1rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" },
      prompt: { color: "#FF7B72" },
      textSm: { fontSize: baseFontSize * 0.95 },
      textXs: { fontSize: baseFontSize * 0.85, color: "#8B949E" },
      header: { marginBottom: "3rem", borderBottom: "1px dashed #30363D", paddingBottom: "2rem" },
      name: { fontSize: baseFontSize * 2.5, fontWeight: "900", color: "#FFF", marginBottom: "0.5rem" },
      profession: { fontSize: baseFontSize * 1.2, color: "#79C0FF", marginBottom: "1rem" },
      contactRow: { display: "flex", flexWrap: "wrap", gap: "1.5rem", fontSize: baseFontSize * 0.85, color: "#8B949E" },
      item: { marginBottom: "1.5rem", borderLeft: "2px solid #30363D", paddingLeft: "1rem", position: "relative" },
      itemDot: { position: "absolute", left: "-6px", top: "6px", width: "10px", height: "10px", borderRadius: "50%", background: accentColor, boxShadow: `0 0 8px ${accentColor}` },
      titleGroup: { marginBottom: "0.5rem" },
      position: { fontWeight: "bold", fontSize: "1.1em", color: "#58A6FF" },
      company: { color: "#C9D1D9" },
      bracket: { color: "#FF7B72" },
      string: { color: "#A5D6FF" },
      skillPill: { background: "rgba(0,255,65,0.1)", color: accentColor, padding: "2px 8px", borderRadius: "4px", fontSize: baseFontSize * 0.85, border: `1px solid ${accentColor}40` }
    };
  };

  const renderSection = (key, index) => {
    const typographyKey = key === "technical_skills" || key === "soft_skills" ? "skills" : key;
    const s = styles(typographyKey);

    const withSortable = (content) => (
      <SortableItem key={key} index={index} total={sections.length} onMoveUp={() => move(sections, setSections, index, "up")} onMoveDown={() => move(sections, setSections, index, "down")}>
        {content}
      </SortableItem>
    );

    switch (key) {
      case "about":
        if (!data.professional_summary) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> cat readme.md</h2>
            <p style={s.textSm}>"{data.professional_summary}"</p>
          </section>
        );

      case "experience":
        if (!hasItems(data.experience)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> git log --experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.item}>
                <div style={s.itemDot}></div>
                <div style={s.titleGroup}>
                  <div style={s.position}>{exp.position}</div>
                  <div style={s.company}>@ {exp.company} <span style={s.bracket}>[</span>{exp.start_date} - {exp.is_current ? "HEAD" : exp.end_date}<span style={s.bracket}>]</span></div>
                </div>
                <p style={{...s.textSm, color: s.string}}>"{exp.description}"</p>
              </div>
            ))}
          </section>
        );

      case "education":
        if (!hasItems(data.education)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> cat education.json</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={s.item}>
                <div style={s.itemDot}></div>
                <div style={{color: "#FFF", fontWeight: "bold"}}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                <div style={s.company}>{edu.institution} <span style={s.bracket}>[</span>{edu.graduation_date}<span style={s.bracket}>]</span></div>
                {edu.gpa && <div style={s.string}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        );

      case "projects":
        if (!hasItems(data.projects)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> ls ./projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={s.item}>
                <div style={s.itemDot}></div>
                <div style={{color: "#D2A8FF", fontWeight: "bold", fontSize: "1.1em"}}>{proj.name}</div>
                <p style={{...s.textSm, marginTop: "4px"}}>"{proj.description}"</p>
              </div>
            ))}
          </section>
        );

      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> ls ./skills</h2>
            <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
              {data.skills.technicalSkills.map((sk, i) => <span key={i} style={s.skillPill}>{sk}</span>)}
            </div>
          </section>
        );

      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> echo soft_skills</h2>
            <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
              {data.skills.softSkills.map((sk, i) => <span key={i} style={s.skillPill}>{sk}</span>)}
            </div>
          </section>
        );

      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> cat languages.json</h2>
            <div style={{display: "flex", flexWrap: "wrap", gap: "10px"}}>
              {data.languages.map((lang, i) => <span key={i} style={s.skillPill}>{lang.language} {lang.proficiency && `(${lang.proficiency})`}</span>)}
            </div>
          </section>
        );

      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> cat achievements.json</h2>
            {data.achievements.map((ach, i) => (
              <div key={i} style={s.item}>
                <div style={s.itemDot}></div>
                <div style={{fontWeight: "bold", color: accentColor}}>{ach.title}</div>
                {ach.description && <p style={{...s.textSm, color: s.string}}>"{ach.description}"</p>}
              </div>
            ))}
          </section>
        );

      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={s.section}>
            <h2 style={s.h2}><span style={s.prompt}>~/</span> cat participations.json</h2>
            {data.participations.map((part, i) => (
              <div key={i} style={s.item}>
                <div style={s.itemDot}></div>
                <div style={{fontWeight: "bold", color: accentColor}}>{part.title}</div>
                {part.organization && <div style={s.company}>{part.organization}</div>}
                {part.description && <p style={{...s.textSm, color: s.string}}>"{part.description}"</p>}
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
              <h2 style={s.h2}><span style={s.prompt}>~/</span> {cs.section_title}</h2>
              {cs.items.map((item, i) => (
                <div key={i} style={s.item}>
                  <div style={s.itemDot}></div>
                  <div style={{fontWeight: "bold", color: accentColor}}>{item.title}</div>
                  {item.description && <p style={{...s.textSm, color: s.string}}>"{item.description}"</p>}
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
        <div style={{color: accentColor, marginBottom: "0.5rem"}}>$ whoami</div>
        <div style={h.name}>{data.personal_info?.full_name?.toLowerCase().replace(" ", "_")}</div>
        {data.personal_info?.profession && <div style={h.profession}>&gt; {data.personal_info.profession}</div>}
        <div style={h.contactRow}>
          {data.personal_info?.email && <div><span style={h.bracket}>email:</span> <span style={h.string}>"{data.personal_info.email}"</span></div>}
          {data.personal_info?.phone && <div><span style={h.bracket}>phone:</span> <span style={h.string}>"{data.personal_info.phone}"</span></div>}
          {data.personal_info?.location && <div><span style={h.bracket}>loc:</span> <span style={h.string}>"{data.personal_info.location}"</span></div>}
          {data.personal_info?.linkedin && <div><span style={h.bracket}>social:</span> <span style={h.string}>"{data.personal_info.linkedin}"</span></div>}
          {data.personal_info?.website && <div><span style={h.bracket}>web:</span> <span style={h.string}>"{data.personal_info.website}"</span></div>}
        </div>
      </header>
      <div>{sections.map((key, i) => renderSection(key, i))}</div>
    </div>
  );
};

export default React.memo(NeonDeveloperTemplate);