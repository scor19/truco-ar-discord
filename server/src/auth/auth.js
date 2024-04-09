import jwt from "jsonwebtoken";
import db from "../db/database.js";
import { serialize } from "cookie";

export async function authenticate(username, password, res) {
  // Busca al usuario en la base de datos
  const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  const user = users[0];

  if (!user || user.password !== password) {
    // Si el usuario no existe o la contraseña es incorrecta, lanza un error
    throw new Error("Invalid username or password");
  }

  // Crea un token JWT
  const token = jwt.sign({ username: user.username }, "trucazo_secret", {
    expiresIn: "1h",
  });

  // Configura la cookie con el token
  const cookie = serialize("token", token, {
    httpOnly: true,
    maxAge: 3600, // 1 hora
    path: "/", // La cookie estará disponible en todas las rutas del dominio
    sameSite: "strict", // La cookie no se enviará en solicitudes de otros sitios
    secure: process.env.NODE_ENV === "production", // Solo enviar en entorno de producción (HTTPS)
  });

  // Envía la cookie al cliente
  res.setHeader("Set-Cookie", cookie);

  return token;
}

export function authenticateToken(req, res, next) {
  //TODO: Implementar lógica de cookies
  const token = req.cookies.token;

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "trucazo_secret", (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
