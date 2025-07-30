const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const Profile = require("./models/Profile");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/profiles", async (req, res) => {
  try {
    console.log(" Incoming profile data:", req.body);
    const data = await Profile.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error(" Error saving profile:", error);
    res.status(500).json({ error: "Error saving profile" });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
