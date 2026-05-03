const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const carFolderPath = path.join(__dirname, "storage", "carList");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryOperation(operation, delay, retries) {
  let error;
  for (let i = 0; i < retries; i++) {
    try {
      await operation();
      return;
    } catch (err) {
      error = err;
      if (err.code !== 'EBUSY') {
        throw err;
      }
      await sleep(delay);
    }
  }
  throw error;
}

// Method to read a car from a file
function get(carId) {
  try {
    const filePath = path.join(carFolderPath, `${carId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadCar", message: error.message };
  }
}

// Method to get rides for a car
function getcarRides(carId) {
  try {
    const filePath = path.join(carFolderPath, `${carId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadCar", message: error.message };
  }
}

// Method to create a new car
function create(car) {
  try {
    car.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(carFolderPath, `${car.id}.json`);
    const fileData = JSON.stringify(car);
    fs.writeFileSync(filePath, fileData, "utf8");
    return car;
  } catch (error) {
    console.error("Failed to create car:", error);
    throw { code: "failedToCreateCar", message: error.message };
  }
}

// Method to update an existing car
function update(car) {
  try {
    const currentCar = get(car.id);
    if (!currentCar) return null;
    const newCar = { ...currentCar, ...car };
    const filePath = path.join(carFolderPath, `${car.id}.json`);
    const fileData = JSON.stringify(newCar);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newCar;
  } catch (error) {
    console.error("Failed to update car:", error);
    throw { code: "failedToUpdateCar", message: error.message };
  }
}

// Method to remove a car by its ID
async function remove(carId) {
  const filePath = path.join(carFolderPath, `${carId}.json`);
  await retryOperation(() => fs.promises.unlink(filePath), 100, 5);
  return {};
}

// Method to list all cars
function list() {
  try {
    const files = fs.readdirSync(carFolderPath);
    const carList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(carFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return carList;
  } catch (error) {
    console.error("Failed to list cars:", error);
    throw { code: "failedToListCars", message: error.message };
  }
}

module.exports = {
  get,
  getcarRides,
  create,
  update,
  remove,
  list,
};
