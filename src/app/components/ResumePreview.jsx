import React from 'react'
import ClassicProTemplate from './templates/ClassicProTemplate'
import ModernEdgeTemplate from './templates/ModernEdgeTemplate'
import CreativeFlowTemplate from './templates/CreativeFlowTemplate'
import DesignerPortfolioTemplate from './templates/DesignerPortfolioTemplate'
import TechFocusTemplate from './templates/TechFocusTemplate'
import AcademicStandardTemplate from './templates/AcademicStandardTemplate'
import CompactOneTemplate from './templates/CompactOneTemplate'
import InfographicMasterTemplate from './templates/InfographicMasterTemplate'
import SidebarEleganceTemplate from './templates/SidebarEleganceTemplate'
import BoldHeaderTemplate from './templates/BoldHeaderTemplate'
import SplitVisionTemplate from './templates/SplitVisionTemplate'
import MinimalistChicTemplate from './templates/MinimalistChicTemplate'
import CorporateStandardTemplate from './templates/CorporateStandardTemplate'
import NeonDeveloperTemplate from './templates/NeonDeveloperTemplate'
import TimelineJourneyTemplate from './templates/TimelineJourneyTemplate'
import GeometricModernTemplate from './templates/GeometricModernTemplate'
import ElegantSerifTemplate from './templates/ElegantSerifTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ProfessionalTemplate from './templates/ProfessionalTemplate'
import CreativeTemplate from './templates/CreativeTemplate'


const ResumePreview = ({ data, template, accentColor, sectionTypographies, classes = "" }) => {

    const renderTemplate = () => {
        switch (template) {
            case "classic-pro":
                return <ClassicProTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "modern-edge":
                return <ModernEdgeTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "creative-flow":
                return <CreativeFlowTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "designer-portfolio":
                return <DesignerPortfolioTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "tech-focus":
                return <TechFocusTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "academic-standard":
                return <AcademicStandardTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "compact-one":
                return <CompactOneTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "infographic-master":
                return <InfographicMasterTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "sidebar-elegance":
                return <SidebarEleganceTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "bold-header":
                return <BoldHeaderTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "split-vision":
                return <SplitVisionTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "minimalist-chic":
                return <MinimalistChicTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "corporate-standard":
                return <CorporateStandardTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "neon-developer":
                return <NeonDeveloperTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "timeline-journey":
                return <TimelineJourneyTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "geometric-modern":
                return <GeometricModernTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "elegant-serif":
                return <ElegantSerifTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "modern":
                return <ModernTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "professional":
                return <ProfessionalTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "creative":
                return <CreativeTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "minimal":
                return <MinimalTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            case "minimal-image":
                return <MinimalImageTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
            default:
                return <ClassicTemplate
                    data={data}
                    accentColor={accentColor}
                    sectionTypographies={sectionTypographies}
                />;
        }
    };

    return (
        <div className='w-full bg-gray-100 flex justify-center py-8'>
            <div id='resume-preview' className={"shadow-xl border border-gray-200 print:shadow-none print:border-none " + classes} >
                {renderTemplate()}
            </div>
            <style>
                {`
            @page{
                size: A4;
                margin: 0;
            }

            @media print{
                html, body{
                    width: 210mm;
                    height: 297mm;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                body * {
                    visibility: hidden;
                }
                #resume-preview, #resume-preview * {
                    visibility: visible;
                }
                #resume-preview {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 210mm;
                    height: 297mm;
                    margin: 0;
                    padding: 0;
                    box-shadow: none !important;
                    border: none !important;
                }
            }
            `}
            </style>
        </div>
    )
}

export default ResumePreview