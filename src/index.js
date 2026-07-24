require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const leadsRouter = require("./routes/leads");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadsRouter);

app.get("/", (req, res) => {
    res.send("LeadDesk Mini API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));