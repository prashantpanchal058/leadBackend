require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const leadsRouter = require("./routes/leads");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");

const app = express();

connectDB();

app.use(cors({
    origin:[ "https://lead-frontend-chi-bay.vercel.app","http://localhost:5173"],
    credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/leads", leadsRouter);

app.get("/", (req, res) => {
  res.send("LeadDesk Mini API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));