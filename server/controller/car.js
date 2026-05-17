const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/car/getAbl");
const ListAbl = require("../abl/car/listAbl");
const getcarRidesAbl = require("../abl/car/getcarRidesAbl");
const CreateAbl = require("../abl/car/createAbl");
const UpdateAbl = require("../abl/car/updateAbl");
const DeleteAbl = require("../abl/car/deleteAbl");

router.get("/get", (req, res) => {
  GetAbl(req, res);
});

router.get("/list", (req, res) => {
  ListAbl(req, res);
});

router.get("/getcarRidesAbl", (req, res) => {
    getcarRidesAbl(req, res);
  });

router.post("/create", (req, res) => {
  CreateAbl(req, res);
});

router.post("/update", (req, res) => {
  UpdateAbl(req, res);
});

router.post("/delete", (req, res) => {
  DeleteAbl(req, res);
});

module.exports = router;
