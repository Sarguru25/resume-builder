import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"
import Resume from "@/lib/models/Resume"
import { calculateATSScore } from "@/lib/atsScore";

export async function POST(req) {
  try {
    await connectDB();

    const { resumeId, role } = await req.json();

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const result = calculateATSScore(resume, role);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Resume from "@/lib/models/Resume";
// import { calculateATSScore } from "@/lib/atsScore";
// import { aiATSAnalysis } from "@/lib/atsAI";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { resumeId, role } = await req.json();

//     const resume = await Resume.findById(resumeId);

//     if (!resume) {
//       return NextResponse.json(
//         { error: "Resume not found" },
//         { status: 404 }
//       );
//     }

//     /* RULE BASED SCORE */

//     const ruleResult = calculateATSScore(resume, role);

//     /* AI SCORE */

//     const aiResult = await aiATSAnalysis(resume, role);

//     /* FINAL SCORE */

//     const finalScore = Math.round(
//       ruleResult.score * 0.6 + aiResult.aiScore * 0.4
//     );

//     return NextResponse.json({
//       finalScore,
//       ruleScore: ruleResult.score,
//       aiScore: aiResult.aiScore,
//       matchedKeywords: ruleResult.matchedKeywords,
//       missingKeywords: ruleResult.missingKeywords,
//       strengths: aiResult.strengths,
//       improvements: aiResult.improvements,
//       tips: ruleResult.tips
//     });

//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }