const mDnsSd = require("node-dns-sd");
const fs = require("fs");
// const getConnectedWifi = require("./getWifI");
const { insertInstances } = require("./dbFunctions");

let unique_IPs = new Set(); // Set to track unique device IPs
let discovered_devices = []; // List to store discovered devices

/**
 * Discover devices on the local network using mDNS
 */
async function discoverDevices() {
  try {
    const device_list = await mDnsSd.discover({
      name: "_googlecast._tcp.local", // Discover Google Cast devices
    });

    // const wifi = await getConnectedWifi(); // Get connected Wi-Fi network info

    // Map discovered devices to a structured format
    const devices_data = device_list.map((device) => ({
      ip_address: device.address,
      familyName: device.familyName,
      modelName: device.modelName,
      fqdn: device.fqdn,
      port: device.service.port,
      protocol: device.service.protocol,
      // network: wifi,
    }));

    // Filter new devices by checking if their IP is already in the Set
    for (const device of devices_data) {
      const ip = device.ip_address;
      if (!unique_IPs.has(ip)) {
        unique_IPs.add(ip); // Add new IP to the Set
        discovered_devices.push(device); // Add new device to the list
      }
    }
  } catch (error) {
    console.error("Discovery error:", error);
  }
}

/**
 * Save discovered devices to a JSON file
 */
function saveToFile(filename, data) {
  const jsonData = JSON.stringify(data, null, 2); // Pretty-print JSON data
  fs.writeFile(filename, jsonData, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    }
  });
}

/**
 * Prepare the data to be sent to the PI and insert into the database
 */
async function processDiscoveredDevices() {
  const dataToSend = discovered_devices.map((device) => ({
    ip_address: device.ip_address,
    familyName: device.familyName,
    modelName: device.modelName,
    fqdn: device.fqdn,
    port: device.port,
    protocol: device.protocol,
    network: device.network,
    unique_id: `${device.network}-${device.ip_address}`, // Unique ID per device
  }));

  // Insert the device instances into the database
  await insertInstances(dataToSend);
}

/**
 * Main function to continuously run device discovery
 */
async function runDiscovery() {
  console.log("Running discovery...");
  let attempt = 1;

  // Infinite loop to periodically run device discovery
  while (true) {
    console.log(`Discovery attempt ${attempt}`);
    await discoverDevices();
    attempt++;

    // Log the discovered devices as a table to the console
    console.table(discovered_devices);

    // Save discovered devices to a JSON file
    saveToFile("device_list.json", discovered_devices);

    // Process and insert discovered devices into the database
    // await processDiscoveredDevices();

    // Wait for 5 seconds before the next discovery attempt
    await wait(5000);
  }
}

/**
 * Utility function to pause execution for a given delay
 */
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

module.exports = runDiscovery;
