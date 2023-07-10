import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req })
  if (!token) return new NextResponse("Unauthorized", { status: 401 })
  return NextResponse.json(token)
  //   {
  //     "name": "alwan",
  //     "email": "alwan@gmail.com",
  //     "sub": "1",
  //     "iat": 1688947809,
  //     "exp": 1691539809,
  //     "jti": "af1c2da7-a000-4e05-8adc-80a6f850ca3d"
  // }
}
