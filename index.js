const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const runDiscovery = require("./utils/discovery");
const { default: axios } = require("axios");
const { token, instances_API } = require("./constants");
const { getInstances } = require("./utils/dbFunctions");

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Check health of the service
app.get("/health", (req, res) => {
  res.send("Service Running");
});

// Get Devices
app.get("/get-devices", async (req, res) => {
  let response = await getInstances();
  res.json(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  runDiscovery();
});
