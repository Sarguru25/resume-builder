'use client'

import React from 'react'
// import { useSelector } from 'react-redux';
import Link from 'next/link'

const Hero = () => {
    // const {user} = useSelector((state) => state.auth);
    const user = null
 
    const [menuOpen, setMenuOpen] = React.useState(false);

    const logos = [
        'https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/framer.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg',
    ]

    return (
        <>
            <div className="min-h-screen pb-20">
                {/* Navbar */}
                <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
                    <a href="https://prebuiltui.com">
                        <img src="/logo.svg" alt="logo" className='h-11 w-auto' />
                    </a>

                    <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                        <a href="#" className="hover:text-green-600 transition">Home</a>
                        <a href="#features" className="hover:text-green-600 transition">Features</a>
                        <a href="#testimonials" className="hover:text-green-600 transition">Testimonials</a>
                        <a href="#cta" className="hover:text-green-600 transition">Contact</a>
                    </div>

                    <div className="flex gap-2">
                        <Link href='/app?state=register' className="hidden md:block px-6 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white" hidden={user} >
                            Get started
                        </Link>
                        <Link href='/app?state=login' className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900" hidden={user} >
                            Login
                        </Link>
                        <Link href='/app' className="hidden md:block px-8 py-2 border bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-full duration-300 text-white" hidden={!user} >
                            Dashboard
                        </Link>
                    </div>

                    {/* Improved Hamburger Button */}
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-5 h-0.5 bg-slate-800 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                        <span className={`block w-5 h-0.5 bg-slate-800 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`block w-5 h-0.5 bg-slate-800 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                    </button>
                </nav>

                {/* Improved Mobile Menu */}
                <div 
                    className={`fixed top-0 left-0 w-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}
                    style={{ height: 'auto', minHeight: '100vh' }} // Ensure it covers the screen
                >
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <img src="/logo.svg" alt="logo" className='h-8 w-auto' />
                        <button 
                            onClick={() => setMenuOpen(false)} 
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                            aria-label="Close menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-x">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Menu Links */}
                    <div className="flex flex-col items-center gap-6 py-8 text-lg">
                        <a href="#" className="text-slate-800 hover:text-green-600 transition" onClick={() => setMenuOpen(false)}>Home</a>
                        <a href="#features" className="text-slate-800 hover:text-green-600 transition" onClick={() => setMenuOpen(false)}>Features</a>
                        <a href="#testimonials" className="text-slate-800 hover:text-green-600 transition" onClick={() => setMenuOpen(false)}>Testimonials</a>
                        <a href="#cta" className="text-slate-800 hover:text-green-600 transition" onClick={() => setMenuOpen(false)}>Contact</a>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center gap-4 px-6 pb-8">
                        <Link href='/app' className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-3 text-center transition" onClick={() => setMenuOpen(false)}>
                            Get started
                        </Link>
                        <Link href='/app?state=login' className="w-full max-w-xs border border-slate-400 hover:bg-green-50 text-slate-700 rounded-full px-6 py-3 text-center transition" onClick={() => setMenuOpen(false)}>
                            Login
                        </Link>
                    </div>
                </div>

                {/* Backdrop for Mobile Menu */}
                {menuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30 md:hidden" 
                        onClick={() => setMenuOpen(false)}
                    ></div>
                )}

                {/* Hero Section */}
                <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
                    <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-green-300 blur-[100px] opacity-30"></div>

                    {/* Avatars + Stars */}
                    <div className="flex items-center mt-24">
                        <div className="flex -space-x-3 pr-3">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]" />
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]" />
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]" />
                            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]" />
                        </div>

                        <div>
                            <div className="flex ">
                                {Array(5).fill(0).map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-transparent fill-green-600" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                                ))}
                            </div>
                            <p className="text-sm text-gray-700">
                                Used by 10,000+ users
                            </p>
                        </div>
                    </div>

                    {/* Headline + CTA */}
                    <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]">
                        Create Professional Resumes in Minutes  <span className=" bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent text-nowrap"> with AI </span>
                    </h1>

                    <p className="max-w-md text-center text-base my-7">Create a professional resume in minutes with our AI-powered resume builder.</p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4 ">
                        <Link href='/app' className="bg-green-500 hover:bg-green-600 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-green-400 flex items-center transition-colors">
                            Get started
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 size-4" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </Link>
                        <button className="flex items-center gap-2 border border-slate-400 hover:bg-green-50 transition rounded-full px-7 h-12 text-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video size-5" aria-hidden="true"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                            <span>Try demo</span>
                        </button>
                    </div>

                    {/* <p className="py-6 text-slate-600 mt-14">Trusting by leading brands, including</p> */}

                    {/* <div className="flex flex-wrap justify-between max-sm:justify-center gap-6 max-w-3xl w-full mx-auto py-4" id="logo-container">
                        {logos.map((logo, index) => <img key={index} src={logo} alt="logo" className="h-6 w-auto max-w-xs" />)}
                    </div> */}
                </div>
            </div>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                    * {
                        font-family: 'Poppins', sans-serif;
                    }
                `}
            </style>
        </>
    )
}

export default Hero