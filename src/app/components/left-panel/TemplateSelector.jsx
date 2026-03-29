import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange, panel = false }) => {

    const [isOpen, setIsOpen] = useState(false)

    const templates = [
        {
            id: "classic-pro",
            name: "Classic Pro",
            image: "/templates/classic-pro.png"
        },
        {
            id: "modern-edge",
            name: "Modern Edge",
            image: "/templates/modern-edge.png"
        },
        {
            id: "creative-flow",
            name: "Creative Flow",
            image: "/templates/creative-flow.png"
        },
        {
            id: "designer-portfolio",
            name: "Designer Portfolio",
            image: "/templates/designer-portfolio.png"
        },
        {
            id: "tech-focus",
            name: "Tech Focus",
            image: "/templates/tech-focus.png"
        },
        {
            id: "academic-standard",
            name: "Academic Standard",
            image: "/templates/academic-standard.png"
        },
        {
            id: "compact-one",
            name: "Compact One",
            image: "/templates/compact-one.png"
        },
        {
            id: "infographic-master",
            name: "Infographic",
            image: "/templates/infographic-master.png"
        },
        {
            id: "sidebar-elegance",
            name: "Sidebar Elegance",
            image: "/templates/sidebar-elegance.png"
        },
        {
            id: "bold-header",
            name: "Bold Header",
            image: "/templates/bold-header.png"
        },
        {
            id: "split-vision",
            name: "Split Vision",
            image: "/templates/split-vision.png"
        },
        {
            id: "minimalist-chic",
            name: "Minimalist Chic",
            image: "/templates/minimalist-chic.png"
        },
        {
            id: "corporate-standard",
            name: "Corporate Standard",
            image: "/templates/corporate-standard.png"
        },
        {
            id: "neon-developer",
            name: "Neon Developer",
            image: "/templates/neon-developer.png"
        },
        {
            id: "timeline-journey",
            name: "Timeline Journey",
            image: "/templates/timeline-journey.png"
        },
        {
            id: "geometric-modern",
            name: "Geometric Modern",
            image: "/templates/geometric-modern.png"
        },
        {
            id: "elegant-serif",
            name: "Elegant Serif",
            image: "/templates/elegant-serif.png"
        },
        {
            id: "classic",
            name: "Classic (Legacy)",
            image: "/templates/classic.png"
        },
        {
            id: "professional",
            name: "Professional",
            image: "/templates/professional.png"
        },
        {
            id: "creative",
            name: "Creative",
            image: "/templates/creative.png"
        },
        {
            id: "modern",
            name: "Modern",
            image: "/templates/modern.png"
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            image: "/templates/minimal-image.png"
        },
        {
            id: "minimal",
            name: "Minimal",
            image: "/templates/minimal.png"
        },
    ]

    const TemplateCard = ({ template }) => (
        <div
            onClick={() => onChange(template.id)}
            className={`relative cursor-pointer rounded-lg overflow-hidden border transition-all hover:scale-[1.02] duration-500
            ${selectedTemplate === template.id
                    ? 'border-green-500 ring-2 ring-green-300'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
        >

            {/* Preview Image */}
            <img
                src={template.image}
                alt={template.name}
                className="w-full h-40 object-cover p-1"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10  transition-all" />

            {/* Selected check */}
            {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Template Name */}
            <div className="p-2 text-sm font-medium text-center bg-white">
                {template.name}
            </div>
        </div>
    )

    /* PANEL MODE */
    if (panel) {
        return (
            <div className="lg:col-span-5 bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">

                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Layout size={16} />
                    Choose Template
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {templates.map((template) => (
                        <TemplateCard key={template.id} template={template} />
                    ))}
                </div>

            </div>
        )
    }

    /* DROPDOWN MODE */
    return (
        <div className='relative'>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-1 text-sm text-green-600 bg-gradient-to-br from-green-50 to-green-100 ring-green-300 hover:ring px-3 py-2 rounded-lg'
            >
                <Layout size={14} />
                <span className='max-sm:hidden'>Template</span>
            </button>

            {isOpen && (
                <div className='absolute top-full right-0 w-80 p-3 z-10 bg-white rounded-md border border-gray-200 shadow-lg'>

                    <div className="grid grid-cols-2 gap-3">
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => {
                                    onChange(template.id)
                                    setIsOpen(false)
                                }}
                            >
                                <TemplateCard template={template} />
                            </div>
                        ))}
                    </div>

                </div>
            )}

        </div>
    )
}

export default TemplateSelector