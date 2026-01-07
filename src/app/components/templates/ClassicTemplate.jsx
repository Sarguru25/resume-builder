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

// SortableItem component for each draggable section
const SortableItem = ({ id, children }) => {
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
        className="absolute -left-8 top-0 cursor-grab active:cursor-grabbing p-1 rounded"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4 text-gray-400" />
      </div>
      {children}
    </div>
  );
};

const ClassicTemplate = ({ data, accentColor = "#3B82F6" }) => {
  const [sections, setSections] = useState([
    "professional_summary",
    "experience",
    "projects",
    "education",
    "skills",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
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
    switch (sectionKey) {
      case "professional_summary":
        return data.professional_summary ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed p-4 rounded-lg ">
                {data.professional_summary}
              </p>
            </section>
          </SortableItem>
        ) : null;

      case "experience":
        return data.experience && data.experience.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 pl-4 py-2 bg-white rounded-r-lg" >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </SortableItem>
        ) : null;

      case "projects":
        return data.projects && data.projects.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                PROJECTS
              </h2>
              <ul className="space-y-3">
                {data.projects.map((proj, index) => (
                  <li key={index} className="border-l-4 pl-6 py-2  rounded-r-lg" style={{ borderColor: "#d1d5db" }}>
                    <div>
                      <span className="font-semibold text-gray-800">{proj.name} {proj.type && `(${proj.type})`}</span>
                      <p className="text-gray-600 whitespace-pre-line mt-1">{proj.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </SortableItem>
        ) : null;

      case "education":
        return data.education && data.education.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                EDUCATION
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start py-2 bg-white rounded-lg p-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{formatDate(edu.graduation_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </SortableItem>
        ) : null;

      case "skills":
        return data.skills && data.skills.length > 0 ? (
          <SortableItem key={sectionKey} id={sectionKey}>
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                 CORE SKILLS
              </h2>
              <div className="flex gap-4 flex-wrap  p-4 rounded-lg">
                {data.skills.map((skill, index) => (
                  <span key={index} className="bg-white px-3 py-1 rounded-full text-gray-700 ">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </SortableItem>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div
      className="max-w-none mx-auto p-8 bg-white text-gray-800 leading-relaxed font-sans border-2 border-gray-200 rounded-lg"
      style={{
        width: "210mm",
        height: "297mm",
        boxSizing: "border-box",
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .drag-handle { display: none; }
          body { background: white; }
        }
      `}</style>

      {/* Header */}
      <header className="text-center mb-8 pb-6 border-b-4 " >
        <h1 className="text-4xl font-bold mb-2" style={{ color: accentColor }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="size-4" />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe className="size-4" />
              <span className="break-all">{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Draggable Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          {sections.map((section) => renderSection(section))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default React.memo(ClassicTemplate);
