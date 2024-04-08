import jwt from "jsonwebtoken";
import db from "../db/database.js";

export async function authenticate(username, password) {
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

  return token;
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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
