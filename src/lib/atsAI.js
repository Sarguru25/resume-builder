export async function aiATSAnalysis(resume, role) {
  const resumeText = `
Name: ${resume.personal_info.full_name}

Summary:
${resume.professional_summary}

Skills:
${resume.skills.technicalSkills.join(", ")}

Experience:
${resume.experience
  .map(e => `${e.position} at ${e.company}: ${e.description}`)
  .join("\n")}

Projects:
${resume.projects.map(p => `${p.name}: ${p.description}`).join("\n")}
`;

  const prompt = `
You are an ATS resume evaluator.

Job Role: ${role}

Evaluate the following resume.

Return JSON with:
- aiScore (0-100)
- strengths (array)
- improvements (array)
- missingSkills (array)

Resume:
${resumeText}
`;

  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi3",
      prompt,
      stream: false
    })
  });

  const data = await res.json();

  try {
    return JSON.parse(data.response);
  } catch {
    return {
      aiScore: 70,
      strengths: [],
      improvements: ["AI parsing failed"],
      missingSkills: []
    };
  }
}