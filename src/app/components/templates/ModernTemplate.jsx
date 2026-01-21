import React, { useState, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* =========================
   Sortable Item
========================= */
const SortableItem = ({ id, children }) => {
  const [open, setOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="drag-handle absolute -left-6 top-1 cursor-grab active:cursor-grabbing p-1 print:hidden"
      >
        <GripVertical className="size-4 text-gray-400" />
      </div>
      {children}
    </div>
  );
};

/* =========================
   Modern Template
========================= */
const ModernTemplate = ({ data, accentColor = "#3B82F6", sectionTypographies = {} }) => {
  /* ---------- Section Order ---------- */
  const initialSections = useMemo(() => {
    const base = [
      "professional_summary",
      "experience",
      "projects",
      "education",
      "skills",
      "participations",
      "achievements",
      "languages",
    ];
    const custom =
      data.custom_sections?.map((_, i) => `custom_${i}`) || [];
    return [...base, ...custom];
  }, [data.custom_sections]);

  const [sections, setSections] = useState(initialSections);

  /* ---------- Default Typography Settings ---------- */
  const defaultTypography = {
    header: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
    professional_summary: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
    experience: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
    projects: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
    education: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
    skills: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
    participations: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
    achievements: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
    languages: {
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      lineHeight: 1.5,
    },
  };

  // Merge provided typographies with defaults
  const mergedTypographies = { ...defaultTypography, ...sectionTypographies };

  /* ---------- DnD Sensors ---------- */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* ---------- Utils ---------- */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  /* ---------- Drag End ---------- */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  /* ---------- Computed Styles ---------- */
  const getStylesForSection = (sectionKey) => {
    const typo = mergedTypographies[sectionKey] || mergedTypographies.header;
    const baseFontSize = typo.fontSize;
    return {
      root: {
        width: "210mm",
        height: "297mm",
        margin: "0 auto",
        backgroundColor: "white",
        color: "#1f2937",
        padding: "2rem",
        borderRadius: "0.5rem",
      },
      section: {
        fontFamily: typo.fontFamily,
        fontSize: `${baseFontSize}px`,
        lineHeight: typo.lineHeight,
        marginBottom: "1rem",
        overflow: "hidden",
      },
      textXs: { fontSize: `${baseFontSize * 0.75}px` },
      textSm: { fontSize: `${baseFontSize * 0.875}px` },
      textLg: { fontSize: `${baseFontSize * 1.25}px` },
      text2xl: { fontSize: `${baseFontSize * 1.6}px` },
      h2: { fontSize: `${baseFontSize * 1.25}px`, fontWeight: "600", marginBottom: "0.5rem", color: accentColor },
      p: { color: "#374151" },
      borderL: { borderLeft: "2px solid", paddingLeft: "0.5rem", marginBottom: "0.5rem" },
      flexBetween: { display: "flex", justifyContent: "space-between" },
      fontSemibold: { fontWeight: "600" },
      textGray500: { color: "#6b7280" },
      textGray600: { color: "#4b5563" },
      bgGray100: { backgroundColor: "#f3f4f6", padding: "0.125rem 0.5rem", borderRadius: "0.25rem" },
      flexWrap: { display: "flex", flexWrap: "wrap", gap: "0.25rem" },
      header: { textAlign: "center", marginBottom: "0.75rem", borderBottom: "1px solid", paddingBottom: "0.5rem" },
      headerH1: { fontSize: `${baseFontSize * 1.6}px`, fontWeight: "bold", color: accentColor },
      headerDiv: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem", color: "#4b5563" },
    };
  };

  /* ---------- Render Sections ---------- */
  const renderSection = (sectionKey) => {
    const styles = getStylesForSection(sectionKey);
    switch (sectionKey) {
      case "professional_summary":
        return data.professional_summary ? (
          <SortableItem id={sectionKey} key={sectionKey}>
            <section style={styles.section}>
              <h2 style={styles.h2}>PROFESSIONAL SUMMARY</h2>
              <p style={{ ...styles.textSm, ...styles.p }}>
                {data.professional_summary}
              </p>
            </section>
          </SortableItem>
        ) : null;

      case "experience":
        return data.experience?.length ? (
          <SortableItem id={sectionKey} key={sectionKey}>
            <section style={styles.section}>
              <h2 style={styles.h2}>EXPERIENCE</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ ...styles.borderL, ...styles.textSm }}>
                  <div style={styles.flexBetween}>
                    <span style={styles.fontSemibold}>{exp.position}</span>
                    <span style={{ ...styles.textXs, ...styles.textGray500 }}>
                      {formatDate(exp.start_date)} –{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p style={styles.p}>{exp.company}</p>
                  {exp.description && (
                    <p style={{ ...styles.textXs, ...styles.textGray600, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          </SortableItem>
        ) : null;

      case "projects":
        return data.projects?.length ? (
          <SortableItem id={sectionKey} key={sectionKey}>
            <section style={styles.section}>
              <h2 style={styles.h2}>PROJECTS</h2>
              {data.projects.map((p, i) => (
                <div key={i} style={{ ...styles.borderL, ...styles.textSm, marginBottom: "0.25rem" }}>
                  <span style={styles.fontSemibold}>{p.name}</span>
                  {p.type && ` (${p.type})`}
                  {p.description && (
                    <p style={{ ...styles.textXs, ...styles.textGray600, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          </SortableItem>
        ) : null;

      case "education":
        return data.education?.length ? (
          <SortableItem id={sectionKey} key={sectionKey}>
            <section style={styles.section}>
              <h2 style={styles.h2}>EDUCATION</h2>
              {data.education.map((e, i) => (
                <div key={i} style={{ ...styles.borderL, ...styles.textSm, marginBottom: "0.25rem" }}>
                  <span style={styles.fontSemibold}>
                    {e.degree} {e.field && `in ${e.field}`}
                  </span>
                  <p style={{ ...styles.textXs, ...styles.textGray600 }}>{e.institution}</p>
                  {e.graduation_date && (
                    <p style={{ ...styles.textXs, ...styles.textGray500 }}>
                      {formatDate(e.graduation_date)}
                    </p>
                  )}
                </div>
              ))}
            </section>
          </SortableItem>
        ) : null;

      case "skills":
        return data.skills ? (
          <SortableItem id={sectionKey} key={sectionKey}>
            <section style={styles.section}>
              <h2 style={styles.h2}>SKILLS</h2>
              <div style={{ ...styles.flexWrap, ...styles.textXs }}>
                {[
                  ...(data.skills.technicalSkills || []),
                  ...(data.skills.softSkills || []),
                ].map((s, i) => (
                  <span key={i} style={styles.bgGray100}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          </SortableItem>
        ) : null;

      // Add other sections here (participations, achievements, languages, etc.)

      default:
        // Handle custom sections
        if (sectionKey.startsWith('custom_')) {
          const index = parseInt(sectionKey.split('_')[1]);
          const customSection = data.custom_sections?.[index];
          if (!customSection) return null;
          
          return (
            <SortableItem id={sectionKey} key={sectionKey}>
              <section style={styles.section}>
                <h2 style={styles.h2}>{customSection.title?.toUpperCase() || "CUSTOM SECTION"}</h2>
                <div style={{ ...styles.textSm, ...styles.p }}>
                  {customSection.content}
                </div>
              </section>
            </SortableItem>
          );
        }
        return null;
    }
  };

  const headerStyles = getStylesForSection("header");

  /* ---------- Render ---------- */
  return (
    <div style={headerStyles.root}>
      {/* Header */}
      <header style={headerStyles.header}>
        <h1 style={headerStyles.headerH1}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <div style={headerStyles.headerDiv}>
          {data.personal_info?.email && (
            <>
              <Mail className="size-4" />
              {data.personal_info.email}
            </>
          )}
          {data.personal_info?.phone && (
            <>
              <Phone className="size-4" />
              {data.personal_info.phone}
            </>
          )}
          {data.personal_info?.location && (
            <>
              <MapPin className="size-4" />
              {data.personal_info.location}
            </>
          )}
          {data.personal_info?.linkedin && (
            <>
              <Linkedin className="size-4" />
              {data.personal_info.linkedin}
            </>
          )}
          {data.personal_info?.website && (
            <>
              <Globe className="size-4" />
              {data.personal_info.website}
            </>
          )}
        </div>
      </header>

      {/* Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections}
          strategy={verticalListSortingStrategy}
        >
          {sections.map(renderSection)}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default React.memo(ModernTemplate);