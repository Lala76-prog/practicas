const express = require("express");
const path = require("path");
const app = express();

// Ruta a la carpeta build de React
const buildPath = path.join(__dirname, "build");

// Servir archivos estáticos
app.use(express.static(buildPath));

// Enrutamiento para SPA: cualquier ruta devolverá index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
