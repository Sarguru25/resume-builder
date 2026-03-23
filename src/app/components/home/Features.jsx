'use client'

import { Zap } from "lucide-react";
import React from "react";
import Title from "./Title";

const Features = () => {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <div
      id="features"
      className="flex flex-col items-center justify-center my-10 scroll-mt-12"
    >
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 border border-green-200 rounded-full px-6 py-1.5">
        <Zap width={14} />
        <span>Simple Process</span>
      </div>

      <Title
        title="Build Your Resume with AI"
        description="Create a professional, job-ready resume in minutes using our intelligent AI tools designed to help you stand out to recruiters."
      />

      <div className="flex flex-col md:flex-row items-center justify-center xl:-mt-10">
        <img
          className="max-w-2xl w-full xl:-ml-32"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
          alt="resume builder features"
        />

        <div
          className="px-4 md:px-0"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {/* Feature 1 */}
          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
            <div
              className={`p-6 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300 flex gap-4 rounded-xl transition-colors ${
                !isHover ? "border-violet-300 bg-violet-100" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 stroke-violet-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="9" />
              </svg>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  AI Resume Generation
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Generate professional resume content instantly using
                  advanced AI based on your experience and career goals.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
            <div className="p-6 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 flex gap-4 rounded-xl transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 stroke-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  ATS-Optimized Resumes
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Our resumes are structured to pass Applicant Tracking
                  Systems and improve your chances of getting shortlisted.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
            <div className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
              <svg
                className="size-6 stroke-orange-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  Customizable Templates
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Choose from modern resume templates and easily customize
                  layouts, sections, and styles to match your personal brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Features;