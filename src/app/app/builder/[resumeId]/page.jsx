"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import LeftPanel from "@/app/components/left-panel/LeftPanel";

import { ArrowLeftIcon, User, FileText, Briefcase, GraduationCap, FolderIcon, Sparkles, Award, Languages, Users, LayoutGrid, Share2Icon, DownloadIcon, EyeIcon, EyeOffIcon, LayoutTemplate, Shapes, Crown, UploadCloud, Wrench, Folder, TextCursorInput, Type, BotMessageSquare, SearchCheck, Grid, } from "lucide-react";

import AIChatAssistant from "@/app/components/left-panel/AIChatAssistant";
import ATSChecker from "@/app/components/left-panel/ATSChecker";
import TemplateSelector from "@/app/components/left-panel/TemplateSelector";
import ResumePreview from "@/app/components/ResumePreview";
import ColorPicker from "@/app/components/left-panel/ColorPicker";
import TypographySettings from "@/app/components/left-panel/TypographySettings"; // Import the new component
import Projects from "@/app/components/left-panel/Projects";
const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { data: session, status } = useSession();
  const [active, setActive] = useState("templates");

  const [resumeData, setResumeData] = useState({
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: { technicalSkills: [], softSkills: [] },
    participations: [],
    achievements: [],
    languages: [],
    custom_sections: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  // Add typography state
  const [showTypographySettings, setShowTypographySettings] = useState(false);
  const [selectedTypographySection, setSelectedTypographySection] =
    useState("header");
  const [sectionTypographies, setSectionTypographies] = useState({
    header: { fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.5 }
  });

  const updateTypography = (key, value) => {
    setSectionTypographies((prev) => {
      // If value is null, we are clearing the override for inheritance
      const currentSection = prev[selectedTypographySection] || {};
      const newSection = { ...currentSection, [key]: value };
      
      if (value === null) {
        delete newSection[key];
      }

      return {
        ...prev,
        [selectedTypographySection]: newSection,
      };
    });
  };

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
    { id: "participations", name: "Participations", icon: Users },
    { id: "achievements", name: "Achievements", icon: Award },
    { id: "languages", name: "Languages", icon: Languages },
    { id: "custom", name: "Custom Sections", icon: LayoutGrid },
  ];
  const activeSection = sections[activeSectionIndex];

  /* ---------------- TYPOGRAPHY FUNCTIONS ---------------- */

  useEffect(() => {
    if (!resumeId || status !== "authenticated") return;

    const loadResume = async () => {
      try {
        const res = await fetch(`/api/resumes/${resumeId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        setResumeData(data.resume);

        // Load saved typography if exists
        if (data.resume.typography) {
          setSectionTypographies(data.resume.typography);
        }

        document.title = data.resume.title;
      } catch (err) {
        toast.error(err.message);
      }
    };

    loadResume();
  }, [resumeId, status]);

  /* ---------------- SAVE RESUME ---------------- */
  const saveResume = async () => {
    const cloned = structuredClone(resumeData);
    const formData = new FormData();

    formData.append("resumeId", resumeId);

    if (typeof cloned.personal_info?.image === "object") {
      delete cloned.personal_info.image;
    }

    // Add typography to saved data
    cloned.typography = sectionTypographies;

    formData.append("resumeData", JSON.stringify(cloned));

    if (removeBackground) {
      formData.append("removeBackground", "yes");
    }

    if (typeof resumeData.personal_info?.image === "object") {
      formData.append("image", resumeData.personal_info.image);
    }

    const res = await fetch(`/api/resumes/${resumeId}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to save resume");
    }
  };

  /* ---------------- PUBLIC / PRIVATE ---------------- */
  const togglePublic = async () => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public: !resumeData.public,
        }),
      });

      if (!res.ok) throw new Error();

      setResumeData((prev) => ({
        ...prev,
        public: !prev.public,
      }));

      toast.success("Visibility updated");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  /* ---------------- SHARE & DOWNLOAD ---------------- */
  const handleShare = () => {
    const url = `${window.location.origin}/view/${resumeId}`;
    navigator.share ? navigator.share({ url, text: "My resume" }) : alert(url);
  };

  const handleDownload = async () => {
    try {
      const resumeElement = document.getElementById("resume-preview");
      const templateHtml = resumeElement.outerHTML;

      // Ensure custom Google Fonts are loaded by Puppeteer, plus standard print CSS
      const htmlPayload = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              @page { size: A4; }
              body {
                background: white !important;
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              #resume-preview {
                width: 100% !important;
                box-shadow: none !important;
                border: none !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .break-inside-avoid, section, .experience-item, .education-item, .project-item {
                page-break-inside: avoid;
                break-inside: avoid;
                display: block;
              }
            </style>
          </head>
          <body>
            ${templateHtml}
          </body>
        </html>
      `;

      const response = await fetch("/api/resumes/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlPayload }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resume.pdf";
      link.click();
    } catch (err) {
      toast.error(err.message);
    }
  };
  // const resumeId = params.id;
  const menuItems = [
    { id: "text", label: "Input", icon: TextCursorInput },
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "typography", label: "Typography", icon: Type },
    { id: "ai", label: "AI", icon: BotMessageSquare },
    { id: "ats", label: "ATS", icon: SearchCheck },
    { id: "projects", label: "Projects", icon: Folder },
    // { id: "tools", label: "Tools", icon: Wrench },
    // { id: "apps", label: "Apps", icon: Grid },
    // { id: "magic", label: "Magic Media", icon: Sparkles },
  ];
  /// RENDER LEFT PANEL BASED ON ACTIVE MENU
  const renderLeftContent = () => {
    switch (active) {
      case "text":
        return (
          <LeftPanel
            resumeData={resumeData}
            setResumeData={setResumeData}
            activeSection={activeSection}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            sections={sections}
            removeBackground={removeBackground}
            setRemoveBackground={setRemoveBackground}
            showTypographySettings={showTypographySettings}
            setShowTypographySettings={setShowTypographySettings}
            sectionTypographies={sectionTypographies}
            selectedTypographySection={selectedTypographySection}
            setSelectedTypographySection={setSelectedTypographySection}
            updateTypography={updateTypography}
            saveResume={saveResume}
            toast={toast}
          />
        );

      case "ats":
        return (
          <div className="lg:col-span-5 bg-white rounded-lg shadow-sm h-max p-6">
            <ATSChecker resumeId={resumeId} />
          </div>
        );

      case "templates":
        return (
          <div className="lg:col-span-5 bg-white rounded-lg shadow-sm h-max p-6">
            <TemplateSelector
              panel={true}
              selectedTemplate={resumeData.template}
              onChange={(template) =>
                setResumeData((prev) => ({
                  ...prev,
                  template,
                }))
              }
            />
          </div>
        );
      case "typography":
        return (
          <div className="lg:col-span-5 bg-white rounded-lg shadow-sm h-max p-6 flex flex-col gap-4">
            <TypographySettings
              sectionTypographies={sectionTypographies}
              selectedSection={selectedTypographySection}
              onUpdateTypography={updateTypography}
              onSelectSection={setSelectedTypographySection}
            />

            <ColorPicker
              selectedColor={resumeData.accent_color}
              onChange={(color) =>
                setResumeData((prev) => ({
                  ...prev,
                  accent_color: color,
                }))
              }
            />
          </div>
        );

      case "text":
        return (
          <LeftPanel
            resumeData={resumeData}
            setResumeData={setResumeData}
            activeSection={activeSection}
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            sections={sections}
          />
        );

      case "ai":
        return (
          <div className="lg:col-span-5 bg-white rounded-lg shadow-sm h-[55%] p-6">
            <AIChatAssistant
              resumeData={resumeData}
              setResumeData={setResumeData}
            />
          </div>
        );

      case "projects":
        return (
          <div className="lg:col-span-5 bg-white rounded-lg shadow-sm h-[55%] p-6">
            <Projects
              resumeData={resumeData}
              setResumeData={setResumeData}
            />
          </div>
        );

      default:
        return (
          <div className="lg:col-span-5 bg-white rounded-lg shadow-sm  p-6 flex items-center justify-center h-[55%] text-gray-400">
            Feature Coming Soon
          </div>
        );
    }
  };

  /* ---------------- AUTH GUARD ---------------- */
  if (status === "loading") return null;
  if (!session) return null;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>
      {/* <Sidebar /> */}

      <aside className="absolute fixed left-0 rounded rounded-tr-2xl rounded-br-2xl w-19 bg-green-300 text-black flex flex-col items-center py-6 hover:left-0 transition-all duration-300">
        <div className="flex flex-col gap-6 w-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex flex-col items-center gap-1 py-2 w-full transition-all duration-200 hover:scale-110 rounded-lg
                ${isActive
                    ? "text-white bg-green-500 scale-115"
                    : "hover:bg-green-500 hover:text-white scale-110 transition-all duration-200"
                  }
              `}
              >
                <Icon
                  size={22}
                  className={
                    isActive
                      ? "text-white scale-110 transition-all duration-200"
                      : ""
                  }
                />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:ml-0 ml-10 lg:grid-cols-12 gap-8">
          {/* LEFT PANEL */}

          {renderLeftContent()}

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}
                <button
                  onClick={togglePublic}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>
            <ResumePreview
              id="resume-preview"
              className="-m-[3px]"
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
              sectionTypographies={sectionTypographies}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
