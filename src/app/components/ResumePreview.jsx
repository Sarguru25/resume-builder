import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ProfessionalTemplate from './templates/ProfessionalTemplate'
import CreativeTemplate from './templates/CreativeTemplate'


const ResumePreview = ({ data, template, accentColor, sectionTypographies, classes = "" }) => {

    const renderTemplate = () => {
        switch (template) {
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