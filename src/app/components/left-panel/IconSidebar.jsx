// 'use client'

// import {
//   LayoutTemplate,
//   Palette,
//   Type,
//   Columns
// } from "lucide-react"

// export default function IconSidebar({ activePanel, setActivePanel }) {

//   const items = [
//     { id: "templates", icon: LayoutTemplate },
//     { id: "colors", icon: Palette },
//     { id: "typography", icon: Type },
//     { id: "layout", icon: Columns },
//   ]

//   return (
//     <div className="h-full bg-[#0f172a] text-white rounded-lg p-2 flex flex-col items-center gap-4">

//       {items.map(item => {
//         const Icon = item.icon
//         const active = activePanel === item.id

//         return (
//           <button
//             key={item.id}
//             onClick={() => setActivePanel(item.id)}
//             className={`p-3 rounded-lg transition-all
//               ${active
//                 ? "bg-teal-500"
//                 : "hover:bg-slate-700"
//               }`}
//           >
//             <Icon className="size-5" />
//           </button>
//         )
//       })}

//     </div>
//   )
// }