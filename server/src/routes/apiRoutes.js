import express from "express";
import { authenticate, authenticateToken } from "../auth/auth.js";

const router = express.Router();

router.post("/authenticate", async (req, res) => {
  try {
    const token = await authenticate(req.body.username, req.body.password, res);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/ruta_protegida", authenticateToken, (req, res) => {
  // Si el token es válido, req.user estará disponible aquí
  res.send("Bienvenido a la ruta protegida!");
});

export default router;
