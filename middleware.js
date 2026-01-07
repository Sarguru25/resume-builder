// import { getToken } from "next-auth/jwt"
// import { NextResponse } from "next/server"

// export async function middleware(req) {
//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//   })

//   const isAuth = !!token
//   const isAppRoute = req.nextUrl.pathname.startsWith("/app")

//   if (isAppRoute && !isAuth) {
//     return NextResponse.redirect(new URL("/login", req.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/app/:path*"],
// }



import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token && req.nextUrl.pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/app/:path*"],
}

