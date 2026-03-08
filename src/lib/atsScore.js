import { atsRoles } from "./atsRoles";

export function calculateATSScore(resume, role) {
  let score = 0;
  const tips = [];
  const keywords = atsRoles[role] || [];

  const allText = [
    resume.professional_summary,
    ...resume.skills.technicalSkills,
    ...resume.skills.softSkills,
    ...resume.projects.map(p => p.description),
    ...resume.experience.map(e => e.description),
  ]
    .join(" ")
    .toLowerCase();

  /* CONTACT INFO */
  if (resume.personal_info.email) score += 5;
  else tips.push("Add email");

  if (resume.personal_info.phone) score += 5;
  else tips.push("Add phone number");

  if (resume.personal_info.linkedin) score += 5;
  else tips.push("Add LinkedIn profile");

  /* SUMMARY */
  if (resume.professional_summary?.length > 80) score += 10;
  else tips.push("Write a stronger professional summary");

  /* SKILLS */
  const skillCount = resume.skills.technicalSkills.length;
  if (skillCount >= 5) score += 10;
  else tips.push("Add more technical skills");

  /* EXPERIENCE */
  if (resume.experience.length > 0) score += 15;
  else tips.push("Add work experience or internships");

  /* PROJECTS */
  if (resume.projects.length >= 2) score += 10;
  else tips.push("Add more projects");

  /* EDUCATION */
  if (resume.education.length > 0) score += 5;

  /* KEYWORD MATCH */
  const matched = keywords.filter((k) => allText.includes(k));
  const keywordScore = Math.round((matched.length / keywords.length) * 30);

  score += keywordScore;

  const missingKeywords = keywords.filter((k) => !allText.includes(k));

  if (missingKeywords.length > 0) {
    tips.push(
      `Consider adding these keywords: ${missingKeywords
        .slice(0, 5)
        .join(", ")}`
    );
  }

  return {
    score: Math.min(score, 100),
    matchedKeywords: matched,
    missingKeywords,
    tips,
  };
}