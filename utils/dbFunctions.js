const { default: axios } = require("axios");
const { instances_API, token, insertion_API } = require("../constants");

// Fetch instances from PI
// GET API
const getInstances = async () => {
  try {
    const response = await axios.get(instances_API, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.entities;
  } catch (error) {
    return error;
  }
};

// Push instances into PI
// POST API
const insertInstances = async (payload) => {
  try {
    const response = await axios.post(insertion_API, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Data sent to PI successfully");
  } catch (error) {
    console.error("Error sending data:", error);
  }
};

module.exports = {
  getInstances,
  insertInstances,
};
