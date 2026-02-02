import jwt from "jsonwebtoken"

export async function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    return {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    }
  } catch (err) {
    console.error("Invalid token", err)
    return null
  }
  console.log("TOKEN:", token)
console.log("DECODED:", decoded)

}
