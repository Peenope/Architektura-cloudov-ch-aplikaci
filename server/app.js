const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

const rideController = require("./controller/ride");
const carController = require("./controller/car");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Vozového parku - Aktivní a bez nutnosti přihlášení");
});

app.use("/ride", rideController);
app.use("/car", carController);

app.listen(port, () => {
  console.log(`Server běží na portu ${port}`);
});