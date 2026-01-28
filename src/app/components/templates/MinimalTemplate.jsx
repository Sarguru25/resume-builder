import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  GripVertical,
} from "lucide-react";

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
          top: "6px",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.2s",
        }}
        className="print:hidden"
      >
        <GripVertical size={14} color="#9ca3af" />
        {index > 0 && <button onClick={onMoveUp} style={btn}>↑</button>}
        {index < total - 1 && <button onClick={onMoveDown} style={btn}>↓</button>}
      </div>
      {children}
    </div>
  );
};

const btn = {
  display: "block",
  marginTop: "4px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: "4px",
  fontSize: "10px",
  cursor: "pointer",
};

/* =========================
   Minimal Resume Template
========================= */
const MinimalTemplate = ({ data, accentColor = "#2563eb" }) => {
  const [leftSections, setLeftSections] = useState([
    "contact",
    "skills",
    "languages",
  ]);

  const [rightSections, setRightSections] = useState([
    "professional_summary",
    "experience",
    "projects",
    "education",
    "achievements",
    "participations",
    "custom_sections",
  ]);

  const move = (list, setList, i, dir) => {
    const ni = dir === "up" ? i - 1 : i + 1;
    if (ni < 0 || ni >= list.length) return;
    const copy = [...list];
    [copy[i], copy[ni]] = [copy[ni], copy[i]];
    setList(copy);
  };

  const styles = {
    page: {
      width: "210mm",
      minHeight: "297mm",
      display: "flex",
      fontFamily: "Inter, sans-serif",
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
      fontSize: "14px",
      fontWeight: 600,
      color: accentColor,
      borderBottom: `1px solid ${accentColor}`,
      marginBottom: "0.5rem",
    },
    block: { marginBottom: "1rem" },
    textSm: { fontSize: "12px" },
    textXs: { fontSize: "11px", color: "#6b7280" },
    tag: {
      background: "#e5e7eb",
      borderRadius: "4px",
      padding: "2px 6px",
      fontSize: "11px",
    },
    tags: { display: "flex", flexWrap: "wrap", gap: "4px" },
    borderL: {
      borderLeft: `2px solid ${accentColor}`,
      paddingLeft: "0.5rem",
      marginBottom: "0.6rem",
    },
    name: {
      fontSize: "26px",
      fontWeight: "bold",
      color: accentColor,
      marginBottom: "1rem",
    },
  };

  /* ---------- LEFT ---------- */
  const renderLeft = (key, i) => {
    switch (key) {
      case "contact":
        return (
          <SortableItem key={key} index={i} total={leftSections.length}
            onMoveUp={() => move(leftSections, setLeftSections, i, "up")}
            onMoveDown={() => move(leftSections, setLeftSections, i, "down")}
          >
            <section style={styles.block}>
              <h2 style={styles.h2}>CONTACT</h2>
              {data.personal_info?.email && <div style={styles.textSm}><Mail size={12}/> {data.personal_info.email}</div>}
              {data.personal_info?.phone && <div style={styles.textSm}><Phone size={12}/> {data.personal_info.phone}</div>}
              {data.personal_info?.location && <div style={styles.textSm}><MapPin size={12}/> {data.personal_info.location}</div>}
              {data.personal_info?.linkedin && <div style={styles.textSm}><Linkedin size={12}/> {data.personal_info.linkedin}</div>}
              {data.personal_info?.website && <div style={styles.textSm}><Globe size={12}/> {data.personal_info.website}</div>}
            </section>
          </SortableItem>
        );

      case "skills":
        return (
          <SortableItem key={key} index={i} total={leftSections.length}
            onMoveUp={() => move(leftSections, setLeftSections, i, "up")}
            onMoveDown={() => move(leftSections, setLeftSections, i, "down")}
          >
            <section style={styles.block}>
              <h2 style={styles.h2}>SKILLS</h2>
              <div style={styles.tags}>
                {[...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || [])]
                  .map((s, idx) => <span key={idx} style={styles.tag}>{s}</span>)}
              </div>
            </section>
          </SortableItem>
        );

      case "languages":
        return (
          <SortableItem key={key} index={i} total={leftSections.length}
            onMoveUp={() => move(leftSections, setLeftSections, i, "up")}
            onMoveDown={() => move(leftSections, setLeftSections, i, "down")}
          >
            <section style={styles.block}>
              <h2 style={styles.h2}>LANGUAGES</h2>
              {data.languages?.map((l, idx) => (
                <div key={idx} style={styles.textSm}>
                  {l.language} {l.proficiency && `(${l.proficiency})`}
                </div>
              ))}
            </section>
          </SortableItem>
        );

      default:
        return null;
    }
  };

  /* ---------- RIGHT ---------- */
  const renderRight = (key, i) => {
    switch (key) {
      case "professional_summary":
        return data.professional_summary && (
          <SortableItem key={key} index={i} total={rightSections.length}
            onMoveUp={() => move(rightSections, setRightSections, i, "up")}
            onMoveDown={() => move(rightSections, setRightSections, i, "down")}
          >
            <section style={styles.block}>
              <h2 style={styles.h2}>SUMMARY</h2>
              <p style={styles.textSm}>{data.professional_summary}</p>
            </section>
          </SortableItem>
        );

      case "experience":
        return data.experience?.length && (
          <SortableItem key={key} index={i} total={rightSections.length}
            onMoveUp={() => move(rightSections, setRightSections, i, "up")}
            onMoveDown={() => move(rightSections, setRightSections, i, "down")}
          >
            <section style={styles.block}>
              <h2 style={styles.h2}>EXPERIENCE</h2>
              {data.experience.map((e, idx) => (
                <div key={idx} style={styles.borderL}>
                  <strong>{e.position}</strong>
                  <div style={styles.textXs}>{e.company}</div>
                  <div style={styles.textXs}>
                    {e.start_date} – {e.is_current ? "Present" : e.end_date}
                  </div>
                  {e.description && <p style={styles.textSm}>{e.description}</p>}
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "projects":
        return data.projects?.length && (
          <SortableItem key={key} index={i} total={rightSections.length}
            onMoveUp={() => move(rightSections, setRightSections, i, "up")}
            onMoveDown={() => move(rightSections, setRightSections, i, "down")}
          >
            <section style={styles.block}>
              <h2 style={styles.h2}>PROJECTS</h2>
              {data.projects.map((p, idx) => (
                <div key={idx} style={styles.borderL}>
                  <strong>{p.name}</strong>
                  {p.type && <div style={styles.textXs}>{p.type}</div>}
                  <div style={styles.textSm}>{p.description}</div>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "education":
        return data.education?.length && (
          <SortableItem key={key} index={i} total={rightSections.length}
            onMoveUp={() => move(rightSections, setRightSections, i, "up")}
            onMoveDown={() => move(rightSections, setRightSections, i, "down")}
          >
            <section style={styles.block}>
              <h2 style={styles.h2}>EDUCATION</h2>
              {data.education.map((e, idx) => (
                <div key={idx} style={styles.borderL}>
                  <strong>{e.degree}</strong>
                  <div style={styles.textXs}>{e.institution}</div>
                  {e.gpa && <div style={styles.textXs}>GPA: {e.gpa}</div>}
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "achievements":
        return data.achievements?.length && (
          <SortableItem key={key} index={i} total={rightSections.length}>
            <section style={styles.block}>
              <h2 style={styles.h2}>ACHIEVEMENTS</h2>
              {data.achievements.map((a, idx) => (
                <div key={idx} style={styles.borderL}>
                  <strong>{a.title}</strong>
                  <div style={styles.textSm}>{a.description}</div>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "participations":
        return data.participations?.length && (
          <SortableItem key={key} index={i} total={rightSections.length}>
            <section style={styles.block}>
              <h2 style={styles.h2}>PARTICIPATIONS</h2>
              {data.participations.map((p, idx) => (
                <div key={idx} style={styles.borderL}>
                  <strong>{p.title}</strong>
                  <div style={styles.textSm}>{p.description}</div>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "custom_sections":
        return data.custom_sections?.map((cs, idx) => (
          <section key={idx} style={styles.block}>
            <h2 style={styles.h2}>{cs.section_title}</h2>
            {cs.items.map((it, i) => (
              <div key={i} style={styles.borderL}>
                <strong>{it.title}</strong>
                <div style={styles.textSm}>{it.description}</div>
              </div>
            ))}
          </section>
        ));

      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <aside style={styles.left}>
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
