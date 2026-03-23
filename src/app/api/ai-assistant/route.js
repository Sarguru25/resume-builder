import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {

  try {

    const { message, resumeData } = await req.json()

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const prompt = `
You are an AI resume editor.

User instruction:
${message}

Current resume JSON:
${JSON.stringify(resumeData)}

Return ONLY JSON.

Example:
{
 "action":"update",
 "path":"personalInfo.summary",
 "content":"Improved summary text"
}

Do not add explanations.
Do not wrap in markdown.
`

    const result = await model.generateContent(prompt)

    let text = result.response.text()

    // Remove markdown if Gemini adds it
    text = text.replace(/```json/g, "")
    text = text.replace(/```/g, "")
    text = text.trim()

    const parsed = JSON.parse(text)

    return NextResponse.json(parsed)

  } catch (error) {

    console.error("AI ERROR:", error)

    return NextResponse.json(
      { error: "AI response parsing failed" },
      { status: 500 }
    )

  }

}








// import { NextResponse } from "next/server"

// export async function POST(req) {

//   try {

//     const { message, resumeData } = await req.json()

//     const prompt = `
// You are an AI resume editor.

// User instruction:
// ${message}

// Current resume JSON:
// ${JSON.stringify(resumeData)}

// Return ONLY JSON.

// Example:
// {
//  "action":"update",
//  "path":"personalInfo.summary",
//  "content":"Improved summary text"
// }

// Rules:
// Return JSON only.
// No explanation.
// No markdown.
// `

//     const response = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "phi3",
//         prompt: prompt,
//         stream: false
//       })
//     })

//     const data = await response.json()

//     let text = data.response

//     // Remove markdown if model adds it
//     text = text.replace(/```json/g, "")
//     text = text.replace(/```/g, "")
//     text = text.trim()

//     const parsed = JSON.parse(text)

//     return NextResponse.json(parsed)

//   } catch (error) {

//     console.error("AI ERROR:", error)

//     return NextResponse.json(
//       { error: "AI response parsing failed" },
//       { status: 500 }
//     )

//   }

// }