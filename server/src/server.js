import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config({ path: "../.env" });

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());
app.use("/api", apiRoutes);
app.use("/game", gameRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
