const fs = require('fs');
const path = require('path');

const templatesDir = path.join(process.cwd(), 'src/app/components/templates');

// All 17 templates
const files = [
  'ClassicProTemplate.jsx', 'ModernEdgeTemplate.jsx', 'CreativeFlowTemplate.jsx',
  'DesignerPortfolioTemplate.jsx', 'TechFocusTemplate.jsx', 'AcademicStandardTemplate.jsx',
  'CompactOneTemplate.jsx', 'InfographicMasterTemplate.jsx', 'SidebarEleganceTemplate.jsx',
  'BoldHeaderTemplate.jsx', 'SplitVisionTemplate.jsx', 'MinimalistChicTemplate.jsx',
  'CorporateStandardTemplate.jsx', 'NeonDeveloperTemplate.jsx', 'TimelineJourneyTemplate.jsx',
  'GeometricModernTemplate.jsx', 'ElegantSerifTemplate.jsx'
];

// Helper to determine what style vars to use based on the file content
function getStyles(content, sideContext) {
    if (sideContext === 'left' && content.includes('s.sectionLeft')) return { section: 's.sectionLeft', h2: 's.h2Left', item: 's.itemLeft || s.contactItem || {marginBottom: "0.5rem"}', title: 's.titleLeft || {fontWeight: "600"}', text: 's.textSm || {fontSize: "0.9em"}', xs: 's.textXs || {fontSize: "0.8em"}', borderL: 's.borderL || {}' };
    if (sideContext === 'right' && content.includes('s.sectionRight')) return { section: 's.sectionRight', h2: 's.h2Right', item: 's.itemRight || {marginBottom: "1rem"}', title: 's.titleRight || {fontWeight: "bold"}', text: 's.textSm || {fontSize: "0.9em"}', xs: 's.textXs || {fontSize: "0.8em"}', borderL: 's.borderL || {}' };
    
    // Default fallback styles based on what usually exists
    return {
        section: 's.section || {marginBottom: "1rem"}',
        h2: 's.h2 || {fontWeight: "bold", fontSize: "1.1em"}',
        item: 's.item || s.contactItem || {marginBottom: "0.75rem"}',
        title: 's.titleRight || s.position || {fontWeight: "bold"}',
        text: 's.textSm || {fontSize: "0.9em"}',
        xs: 's.textXs || {fontSize: "0.8em"}',
        borderL: 's.borderL || {}'
    };
}

// Generate the code for a specific case
function generateCaseCode(key, sideContext, content) {
    const st = getStyles(content, sideContext);

    if (key === 'languages') {
        return `
      case "languages":
        if (!hasItems(data.languages)) return null;
        return withSortable(
          <section style={${st.section}}>
            <h2 style={${st.h2}}>Languages</h2>
            {data.languages.map((lang, i) => (
              <div key={i} style={${st.borderL}}>
                <span style={${st.text}}>
                  {lang.language} {lang.proficiency && \`(\${lang.proficiency})\`}
                </span>
              </div>
            ))}
          </section>
        );`;
    }
    if (key === 'certifications') {
        return `
      case "certifications":
        const certs = data.custom_sections?.[0]?.items || [];
        if (!hasItems(certs) && !hasItems(data.certifications)) return null;
        const certSource = hasItems(data.certifications) ? data.certifications : certs;
        return withSortable(
          <section style={${st.section}}>
            <h2 style={${st.h2}}>Certifications</h2>
            {certSource.map((cert, i) => (
              <div key={i} style={${st.item}}>
                <div style={${st.title}}>{cert.title || cert.name}</div>
                {cert.description && <p style={${st.text}}>{cert.description}</p>}
                {cert.issuer && <p style={${st.text}}>{cert.issuer}</p>}
              </div>
            ))}
          </section>
        );`;
    }
    if (key === 'participations') {
        return `
      case "participations":
        if (!hasItems(data.participations)) return null;
        return withSortable(
          <section style={${st.section}}>
            <h2 style={${st.h2}}>Participations</h2>
            {data.participations.map((part, i) => (
              <div key={i} style={${st.item}}>
                <div style={${st.title}}>{part.title}</div>
                {part.organization && <div style={${st.text}}>{part.organization}</div>}
                {part.year && <div style={${st.xs}}>{part.year}</div>}
                {part.description && <p style={${st.text}}>{part.description}</p>}
              </div>
            ))}
          </section>
        );`;
    }
    if (key === 'achievements') {
        return `
      case "achievements":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={${st.section}}>
            <h2 style={${st.h2}}>Achievements</h2>
            {data.achievements.map((ach, i) => (
              <div key={i} style={${st.item}}>
                <div style={${st.title}}>{ach.title}</div>
                {ach.year && <div style={${st.xs}}>{ach.year}</div>}
                {ach.description && <p style={${st.text}}>{ach.description}</p>}
              </div>
            ))}
          </section>
        );`;
    }
    if (key === 'awards') {
        return `
      case "awards":
        if (!hasItems(data.achievements)) return null;
        return withSortable(
          <section style={${st.section}}>
            <h2 style={${st.h2}}>Awards</h2>
            {data.achievements.map((award, i) => (
              <div key={i} style={${st.item}}>
                <div style={${st.title}}>{award.title}</div>
                {award.year && <div style={${st.xs}}>{award.year}</div>}
                {award.description && <p style={${st.text}}>{award.description}</p>}
              </div>
            ))}
          </section>
        );`;
    }
    if (key === 'custom_sections') {
        return `
      default:
        if (key.startsWith("custom_")) {
          const idx = Number(key.split("_")[1]);
          const cs = data.custom_sections?.[idx];
          if (!cs || !hasItems(cs.items)) return null;
          return withSortable(
            <section style={${st.section}}>
              <h2 style={${st.h2}}>{cs.section_title}</h2>
              {cs.items.map((item, i) => (
                <div key={i} style={${st.item}}>
                  <strong style={${st.title}}>{item.title}</strong>
                  {item.description && <p style={${st.text}}>{item.description}</p>}
                </div>
              ))}
            </section>
          );
        }
        return null;`;
    }
    
    // Add missing default skills cases if needed
    if (key === 'technical_skills') {
        return `
      case "technical_skills":
        if (!hasItems(data.skills?.technicalSkills)) return null;
        return withSortable(
          <section style={${st.section}}>
            <h2 style={${st.h2}}>Technical Skills</h2>
            <div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>
              {data.skills.technicalSkills.map((sk, i) => <span key={i} style={${st.text}}>{sk}</span>)}
            </div>
          </section>
        );`;
    }
    if (key === 'soft_skills') {
        return `
      case "soft_skills":
        if (!hasItems(data.skills?.softSkills)) return null;
        return withSortable(
          <section style={${st.section}}>
            <h2 style={${st.h2}}>Soft Skills</h2>
            <div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>
              {data.skills.softSkills.map((sk, i) => <span key={i} style={${st.text}}>{sk}</span>)}
            </div>
          </section>
        );`;
    }
    return '';
}

for (let file of files) {
  const filePath = path.join(templatesDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix GPA & Field in Education
  // {edu.degree} -> {edu.degree}{edu.field && \` in \${edu.field}\`}
  if (content.match(/>\{edu\.degree\}</)) {
      content = content.replace(/>\{edu\.degree\}</g, ">{edu.degree}{edu.field && ` in ${edu.field}`}<");
  }
  
  // Fix type in Projects
  // {proj.name} -> {proj.name}{proj.type && \` - \${proj.type}\`}
  if (content.match(/>\{proj\.name\}</)) {
      content = content.replace(/>\{proj\.name\}</g, ">{proj.name}{proj.type && ` - ${proj.type}`}<");
  }
  
  // Include missing fields in default lists so they render
  // useMemo(() => ["experience", "education", "projects"], [])
  content = content.replace(/useMemo\(\(\) => (\[.*?\])/g, (match, arrStr) => {
      // arrStr looks like ["about", "technical_skills"]
      let arr;
      try { arr = JSON.parse(arrStr); } catch(e) { return match; }
      
      // If it's the right col (or only col), add participations and achievements
      if (arr.includes('experience') || arr.includes('education')) {
          if (!arr.includes('participations')) arr.push('participations');
          if (!arr.includes('achievements')) arr.push('achievements');
          if (!arr.includes('certifications')) arr.push('certifications');
      }
      // If it's the left col (or only col), add languages, soft_skills, technical_skills
      if (arr.includes('about') || arr.includes('contact') || arr.includes('skills')) {
          if (!arr.includes('languages')) arr.push('languages');
          if (!arr.includes('soft_skills') && !arr.includes('skills')) arr.push('soft_skills');
          if (!arr.includes('technical_skills') && !arr.includes('skills')) arr.push('technical_skills');
      }
      return match.replace(arrStr, JSON.stringify(arr));
  });

  // Inject missing cases
  const missingCases = [];
  
  const blocksToInject = [];
  ['languages', 'certifications', 'participations', 'achievements', 'awards', 'technical_skills', 'soft_skills'].forEach(key => {
      if (!content.includes(`case "${key}":`)) {
          blocksToInject.push(key);
      }
  });

  // Handle single switch vs split left/right switch
  if (content.includes('if (side === "left")')) {
      // Split switch
      let parts = content.split('default: return null;');
      if (parts.length === 3) {
          // parts[0] is Left switch
          // parts[1] is Right switch
          // inject left stuff into parts[0], right stuff into parts[1]
          let leftInjections = blocksToInject.filter(k => ['languages', 'technical_skills', 'soft_skills'].includes(k)).map(k => generateCaseCode(k, 'left', content)).join('\\n');
          let rightInjections = blocksToInject.filter(k => ['certifications', 'participations', 'achievements', 'awards'].includes(k)).map(k => generateCaseCode(k, 'right', content)).join('\\n');
          
          let newParts0 = parts[0] + leftInjections + '\\n      default: return null;';
          let newParts1 = parts[1] + rightInjections + '\\n' + generateCaseCode('custom_sections', 'right', content);
          content = newParts0 + newParts1 + parts[2];
      }
  } else {
      // Single switch
      let injections = blocksToInject.map(k => generateCaseCode(k, 'none', content)).join('\\n');
      if (content.includes('default: return null;')) {
          content = content.replace('default: return null;', injections + '\\n' + generateCaseCode('custom_sections', 'none', content));
      } else if (content.includes('default:')) {
          // Replace default: with injections + default:
          content = content.replace('default:', injections + '\\n' + generateCaseCode('custom_sections', 'none', content) + '\\n      default:');
      }
  }

  fs.writeFileSync(filePath, content);
  console.log('Fixed:', file);
}
