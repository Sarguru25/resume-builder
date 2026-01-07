import React from "react";

const MinimalTemplate = ({ data, accentColor = "#3B82F6" }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light leading-snug">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-thin mb-2">{data.personal_info?.full_name || "Your Name"}</h1>
        {data.personal_info?.profession && <p className="text-gray-600 mb-2">{data.personal_info.profession}</p>}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
          {data.personal_info?.linkedin && <span className="break-all">{data.personal_info.linkedin}</span>}
          {data.personal_info?.website && <span className="break-all">{data.personal_info.website}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-8">
          <p className="text-gray-700">{data.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">{exp.company}</p>
                {exp.description && <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-medium">{proj.name}{proj.type && ` (${proj.type})`}</h3>
                {proj.description && <p className="text-gray-700">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-sm text-gray-500">{formatDate(edu.graduation_date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-2 font-medium" style={{ color: accentColor }}>
            Skills
          </h2>
          <div className="text-gray-700">{data.skills.join(" • ")}</div>
        </section>
      )}

      {/* Participations */}
      {data.participations?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-2 font-medium" style={{ color: accentColor }}>
            Participations
          </h2>
          <div className="space-y-2">
            {data.participations.map((p, idx) => (
              <div key={idx}>
                <span className="font-medium">{p.title}</span> - <span className="text-gray-500">{p.organization} ({p.year})</span>
                {p.description && <p className="text-gray-700">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {data.achievements?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-2 font-medium" style={{ color: accentColor }}>
            Achievements
          </h2>
          <div className="space-y-2">
            {data.achievements.map((a, idx) => (
              <div key={idx}>
                <span className="font-medium">{a.title} ({a.year})</span>
                {a.description && <p className="text-gray-700">{a.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest mb-2 font-medium" style={{ color: accentColor }}>
            Languages
          </h2>
          <div className="flex flex-wrap gap-2 text-gray-700">
            {data.languages.map((l, idx) => (
              <span key={idx}>{l.language} ({l.proficiency})</span>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {data.custom_sections?.length > 0 && (
        <section>
          {data.custom_sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="text-sm uppercase tracking-widest mb-2 font-medium" style={{ color: accentColor }}>
                {section.section_title}
              </h2>
              {section.items?.map((item, i) => (
                <div key={i} className="mb-1">
                  <span className="font-medium">{item.title}</span>
                  {item.description && <p className="text-gray-700">{item.description}</p>}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
