const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const rideFolderPath = path.join(__dirname, "storage", "rideList");

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

// Method to read a ride from a file
function get(rideId) {
  try {
    const filePath = path.join(rideFolderPath, `${rideId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadRide", message: error.message };
  }
}

// Method to create a new ride
function create(ride) {
  try {
    const id_car = ride.id_car;
    ride.id = `${id_car}_${crypto.randomBytes(16).toString("hex")}`;
    const filePath = path.join(rideFolderPath, `${ride.id}.json`);
    const fileData = JSON.stringify(ride);
    fs.writeFileSync(filePath, fileData, "utf8");
    return ride;
  } catch (error) {
    console.error("Failed to create ride:", error);
    throw { code: "failedToCreateRide", message: error.message };
  }
}

// Method to update a ride in a file
function update(ride) {
  try {
    const currentRide = get(ride.id);
    if (!currentRide) return null;
    const newRide = { ...currentRide, ...ride };
    const filePath = path.join(rideFolderPath, `${ride.id}.json`);
    const fileData = JSON.stringify(newRide);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newRide;
  } catch (error) {
    console.error("Failed to update ride:", error);
    throw { code: "failedToUpdateRide", message: error.message };
  }
}

// Method to remove a ride from a file
async function remove(rideId) {
  const filePath = path.join(rideFolderPath, `${rideId}.json`);
  await retryOperation(() => fs.promises.unlink(filePath), 100, 5);
  return {};
}

// Method to list rides in a folder
function list() {
  try {
    const files = fs.readdirSync(rideFolderPath);
    const rideList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(rideFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    rideList.sort((a, b) => new Date(a.date) - new Date(b.date));
    return rideList;
  } catch (error) {
    console.error("Failed to list rides:", error);
    throw { code: "failedToListRides", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
