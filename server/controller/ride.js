const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/ride/getAbl");
const ListAbl = require("../abl/ride/listAbl");
const CreateAbl = require("../abl/ride/createAbl");
const UpdateAbl = require("../abl/ride/updateAbl");
const DeleteAbl = require("../abl/ride/deleteAbl");

router.get("/get", (req, res) => {
  GetAbl(req, res);
});

router.get("/list", (req, res) => {
  ListAbl(req, res);
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
