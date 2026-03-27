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
  if (resume.personal_info?.email) score += 5;
  else tips.push("Your resume is missing essential contact info like your email address.");

  if (resume.personal_info?.phone) score += 5;
  else tips.push("Please provide a phone number so recruiters can easily reach you.");

  if (resume.personal_info?.linkedin) score += 5;
  else tips.push("Include your LinkedIn profile URL to increase professional credibility and networking opportunities.");

  /* SUMMARY */
  if (resume.professional_summary?.length > 150) score += 10;
  else tips.push("Your professional summary is quite short. Expand it to highlight your core competencies, experiences, and key achievements.");

  /* SKILLS */
  const skillCount = resume.skills?.technicalSkills?.length || 0;
  if (skillCount >= 8) score += 10;
  else tips.push(`You have listed ${skillCount} technical skills. A competitive resume for a ${role} should explicitly list at least 8 solid technical skills.`);

  /* EXPERIENCE */
  if (resume.experience?.length > 0) score += 15;
  else tips.push("Employers highly value real-world experience. If you lack formal employment, consider adding internships, freelance work, or open-source contributions.");

  /* PROJECTS */
  if (resume.projects?.length >= 2) score += 10;
  else tips.push("Projects demonstrate your practical skills. Try to add at least two detailed projects to showcase what you can build or manage.");

  /* EDUCATION */
  if (resume.education?.length > 0) score += 5;

  /* KEYWORD MATCH */
  const matched = keywords.filter((k) => allText.includes(k.toLowerCase()));
  const keywordScore = Math.round((matched.length / Math.max(keywords.length, 1)) * 35);

  score += keywordScore;

  const missingKeywords = keywords.filter((k) => !allText.includes(k.toLowerCase()));

  if (missingKeywords.length > 0) {
    tips.push(
      `To rank higher in ATS for a ${role} role, seamlessly weave these critical keywords into your experience and summary: ${missingKeywords.slice(0, 6).join(", ")}.`
    );
  } else {
    tips.push(`Great job! Your resume contains all the vital keywords for a ${role}.`);
  }

  // Ensure score doesn't exceed 100
  let finalScore = Math.min(score, 100);

  // General praise or warning
  if (finalScore < 50) {
    tips.push("Overall, your resume needs significant expansion. Focus on adding more detailed bullet points with measurable results in your experience/projects sections.");
  } else if (finalScore >= 90) {
    tips.push("Excellent resume! Make sure every point is quantifiable and your formatting is exceptionally clean.");
  }

  return {
    score: finalScore,
    matchedKeywords: matched,
    missingKeywords,
    tips,
  };
}