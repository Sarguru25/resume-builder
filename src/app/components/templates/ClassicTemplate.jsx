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
   Sortable Section Wrapper
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
        className="print:hidden"
        style={{
          position: "absolute",
          left: "-28px",
          top: "4px",
          opacity: hover ? 1 : 0,
          transition: "0.2s",
        }}
      >
        <GripVertical size={14} />
        {index > 0 && <button onClick={onMoveUp}>↑</button>}
        {index < total - 1 && <button onClick={onMoveDown}>↓</button>}
      </div>
      {children}
    </div>
  );
};

/* =========================
   Architect Resume Template
========================= */
const ArchitectTemplate = ({ data, accentColor = "#000" }) => {
  const [leftSections, setLeftSections] = useState([
    "about",
    "skills",
    "certifications",
    "awards",
  ]);

  const [rightSections, setRightSections] = useState([
    "education",
    "experience",
  ]);

  const move = (list, setList, i, dir) => {
    const n = dir === "up" ? i - 1 : i + 1;
    if (n < 0 || n >= list.length) return;
    const copy = [...list];
    [copy[i], copy[n]] = [copy[n], copy[i]];
    setList(copy);
  };

  const styles = {
    page: {
      width: "210mm",
      minHeight: "297mm",
      background: "#fff",
      margin: "auto",
      padding: "2rem",
      fontFamily: "Inter, sans-serif",
      color: "#111",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #000",
      paddingBottom: "1rem",
      marginBottom: "1.5rem",
    },
    name: { fontSize: 32, fontWeight: 800 },
    profession: {
      background: "#e5e7eb",
      padding: "2px 6px",
      display: "inline-block",
      marginTop: "4px",
    },
    columns: { display: "flex", gap: "2rem" },
    left: { width: "40%" },
    right: { width: "60%" },
    h2: {
      fontSize: 14,
      fontWeight: 700,
      marginBottom: "0.5rem",
      borderBottom: "1px solid #000",
      paddingBottom: "2px",
    },
    textSm: { fontSize: 12, lineHeight: 1.5 },
    item: { marginBottom: "1rem" },
    skillBar: {
      height: "3px",
      background: "#000",
      width: "40px",
      marginRight: "8px",
    },
  };

  /* ---------- LEFT ---------- */
  const renderLeft = (key, i) => {
    switch (key) {
      case "about":
        return (
          <SortableItem key={key} index={i} total={leftSections.length}
            onMoveUp={() => move(leftSections, setLeftSections, i, "up")}
            onMoveDown={() => move(leftSections, setLeftSections, i, "down")}
          >
            <section style={styles.item}>
              <h2 style={styles.h2}>ABOUT ME</h2>
              <p style={styles.textSm}>{data.professional_summary}</p>
            </section>
          </SortableItem>
        );

      case "skills":
        return (
          <SortableItem key={key} index={i} total={leftSections.length}
            onMoveUp={() => move(leftSections, setLeftSections, i, "up")}
            onMoveDown={() => move(leftSections, setLeftSections, i, "down")}
          >
            <section style={styles.item}>
              <h2 style={styles.h2}>SKILLS</h2>
              {data.skills?.technicalSkills?.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={styles.skillBar} />
                  <span style={styles.textSm}>{s}</span>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "certifications":
        return (
          <SortableItem key={key} index={i} total={leftSections.length}
            onMoveUp={() => move(leftSections, setLeftSections, i, "up")}
            onMoveDown={() => move(leftSections, setLeftSections, i, "down")}
          >
            <section style={styles.item}>
              <h2 style={styles.h2}>CERTIFICATIONS</h2>
              {data.custom_sections?.[0]?.items?.map((c, i) => (
                <div key={i} style={styles.textSm}>{c.title}</div>
              ))}
            </section>
          </SortableItem>
        );

      case "awards":
        return (
          <SortableItem key={key} index={i} total={leftSections.length}
            onMoveUp={() => move(leftSections, setLeftSections, i, "up")}
            onMoveDown={() => move(leftSections, setLeftSections, i, "down")}
          >
            <section style={styles.item}>
              <h2 style={styles.h2}>AWARDS</h2>
              {data.achievements?.map((a, i) => (
                <div key={i}>
                  <strong style={styles.textSm}>{a.title}</strong>
                  <div style={styles.textSm}>{a.year}</div>
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
      case "education":
        return (
          <SortableItem key={key} index={i} total={rightSections.length}
            onMoveUp={() => move(rightSections, setRightSections, i, "up")}
            onMoveDown={() => move(rightSections, setRightSections, i, "down")}
          >
            <section style={styles.item}>
              <h2 style={styles.h2}>EDUCATION</h2>
              {data.education?.map((e, i) => (
                <div key={i}>
                  <strong style={styles.textSm}>
                    {e.degree} | {e.graduation_date}
                  </strong>
                  <div style={styles.textSm}>{e.institution}</div>
                </div>
              ))}
            </section>
          </SortableItem>
        );

      case "experience":
        return (
          <SortableItem key={key} index={i} total={rightSections.length}
            onMoveUp={() => move(rightSections, setRightSections, i, "up")}
            onMoveDown={() => move(rightSections, setRightSections, i, "down")}
          >
            <section style={styles.item}>
              <h2 style={styles.h2}>EXPERIENCE</h2>
              {data.experience?.map((e, i) => (
                <div key={i} style={{ marginBottom: "1rem" }}>
                  <strong style={styles.textSm}>
                    {e.position} | {e.start_date} – {e.is_current ? "Present" : e.end_date}
                  </strong>
                  <div style={styles.textSm}>{e.company}</div>
                  <p style={styles.textSm}>{e.description}</p>
                </div>
              ))}
            </section>
          </SortableItem>
        );
      default:
        return null;
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <div style={styles.name}>{data.personal_info?.full_name}</div>
          <div style={styles.profession}>{data.personal_info?.profession}</div>
        </div>
        <div style={{ fontSize: 12 }}>
          {data.personal_info?.phone && <div><Phone size={12} /> {data.personal_info.phone}</div>}
          {data.personal_info?.email && <div><Mail size={12} /> {data.personal_info.email}</div>}
          {data.personal_info?.linkedin && <div><Linkedin size={12} /> {data.personal_info.linkedin}</div>}
          {data.personal_info?.location && <div><MapPin size={12} /> {data.personal_info.location}</div>}
        </div>
      </header>

      <div style={styles.columns}>
        <aside style={styles.left}>{leftSections.map(renderLeft)}</aside>
        <main style={styles.right}>{rightSections.map(renderRight)}</main>
      </div>
    </div>
  );
};

export default React.memo(ArchitectTemplate);
