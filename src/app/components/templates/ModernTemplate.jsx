import React, { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GripVertical } from "lucide-react";
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
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// SortableItem component
const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-0 cursor-grab active:cursor-grabbing p-1 rounded"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4 text-gray-400" />
      </div>
      {children}
    </div>
  );
};

const ModernTemplate = ({ data, accentColor = "#3B82F6" }) => {
  const [sections, setSections] = useState([
    "professional_summary",
    "experience",
    "projects",
    "education",
    "skills",
    "participations",
    "achievements",
    "languages",
    "custom_sections",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderSection = (sectionKey) => {
    const sectionClass = "mb-4 overflow-hidden"; // Added overflow-hidden to fit in page
    switch (sectionKey) {
      case "professional_summary":
        return data.professional_summary ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>PROFESSIONAL SUMMARY</h2>
              <p className="text-gray-700 text-sm leading-snug">{data.professional_summary}</p>
            </section>
          </SortableItem>
        ) : null;

      case "experience":
        return data.experience?.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>EXPERIENCE</h2>
              <div className="space-y-2 text-sm overflow-hidden">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 pl-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">{exp.position}</span>
                      <span className="text-gray-500 text-xs">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                    </div>
                    <p className="text-gray-700">{exp.company}</p>
                    {exp.description && <p className="text-gray-600 text-xs line-clamp-3">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          </SortableItem>
        ) : null;

      case "projects":
        return data.projects?.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>PROJECTS</h2>
              <ul className="space-y-1 text-sm overflow-hidden">
                {data.projects.map((proj, idx) => (
                  <li key={idx} className="pl-2 border-l-2">
                    <span className="font-semibold">{proj.name}</span>
                    {proj.type && <span> ({proj.type})</span>}
                    {proj.description && <p className="text-gray-700 text-xs line-clamp-2">{proj.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          </SortableItem>
        ) : null;

      case "education":
        return data.education?.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>EDUCATION</h2>
              <ul className="space-y-1 text-sm overflow-hidden">
                {data.education.map((edu, idx) => (
                  <li key={idx} className="pl-2 border-l-2">
                    <span className="font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                    <p className="text-gray-700 text-xs">{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-500 text-xs">GPA: {edu.gpa}</p>}
                    {edu.graduation_date && <p className="text-gray-500 text-xs">{formatDate(edu.graduation_date)}</p>}
                  </li>
                ))}
              </ul>
            </section>
          </SortableItem>
        ) : null;

      case "skills":
        return data.skills?.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>SKILLS</h2>
              <div className="flex flex-wrap gap-1 text-xs">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded">{skill}</span>
                ))}
              </div>
            </section>
          </SortableItem>
        ) : null;

      case "participations":
        return data.participations?.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>PARTICIPATIONS</h2>
              <ul className="text-sm overflow-hidden">
                {data.participations.map((p, idx) => (
                  <li key={idx} className="pl-2 border-l-2 mb-1">
                    <span className="font-semibold">{p.title}</span> - {p.organization} ({p.year})
                    {p.description && <p className="text-gray-600 text-xs line-clamp-2">{p.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          </SortableItem>
        ) : null;

      case "achievements":
        return data.achievements?.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>ACHIEVEMENTS</h2>
              <ul className="text-sm overflow-hidden">
                {data.achievements.map((a, idx) => (
                  <li key={idx} className="pl-2 border-l-2 mb-1">
                    <span className="font-semibold">{a.title} ({a.year})</span>
                    {a.description && <p className="text-gray-600 text-xs line-clamp-2">{a.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          </SortableItem>
        ) : null;

      case "languages":
        return data.languages?.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className={sectionClass}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>LANGUAGES</h2>
              <div className="flex flex-wrap gap-1 text-xs">
                {data.languages.map((l, idx) => (
                  <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded">{l.language} ({l.proficiency})</span>
                ))}
              </div>
            </section>
          </SortableItem>
        ) : null;

      case "custom_sections":
        return data.custom_sections?.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            {data.custom_sections.map((section, idx) => (
              <section key={idx} className={sectionClass}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>{section.section_title}</h2>
                <ul className="text-sm overflow-hidden">
                  {section.items.map((item, i) => (
                    <li key={i} className="pl-2 border-l-2 mb-1">
                      <span className="font-semibold">{item.title}</span>
                      {item.description && <p className="text-gray-600 text-xs line-clamp-2">{item.description}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </SortableItem>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      className="mx-auto p-4 bg-white text-gray-800 font-sans border border-gray-200 rounded-lg overflow-hidden"
      style={{ width: "210mm", height: "297mm", boxSizing: "border-box", display: "flex", flexDirection: "column" }}
    >
      <style jsx>{`@media print { .drag-handle { display: none; } body { background: white; } }`}</style>

      {/* Header */}
      <header className="text-center mb-2 pb-2 border-b" style={{ flexShrink: 0 }}>
        <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{data.personal_info?.full_name || "Your Name"}</h1>
        {data.personal_info?.profession && <p className="text-sm text-gray-600">{data.personal_info.profession}</p>}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 mt-1">
          {data.personal_info?.email && <div className="flex items-center gap-1"><Mail className="size-4" />{data.personal_info.email}</div>}
          {data.personal_info?.phone && <div className="flex items-center gap-1"><Phone className="size-4" />{data.personal_info.phone}</div>}
          {data.personal_info?.location && <div className="flex items-center gap-1"><MapPin className="size-4" />{data.personal_info.location}</div>}
          {data.personal_info?.linkedin && <div className="flex items-center gap-1"><Linkedin className="size-4" />{data.personal_info.linkedin}</div>}
          {data.personal_info?.website && <div className="flex items-center gap-1"><Globe className="size-4" />{data.personal_info.website}</div>}
        </div>
      </header>

      {/* Draggable Sections */}
      <div className="flex-1 overflow-y-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections} strategy={verticalListSortingStrategy}>
            {sections.map(renderSection)}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default React.memo(ModernTemplate);
