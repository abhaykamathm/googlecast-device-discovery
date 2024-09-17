const wifi = require("node-wifi");

// Initialize wifi module
// it will try to use `networkmanager` on linux, `netsh` on windows, and `airport` on macOS
wifi.init({
  iface: null, // network interface, choose a specific one or null for default
});

async function getConnectedWifi() {
  try {
    const currentConnection = await wifi.getCurrentConnections();
    if (currentConnection.length > 0) {
      //   console.log("Connected to Wi-Fi:");
      //   console.log(currentConnection[0]);
      return currentConnection[0].ssid;
    } else {
      console.log("Not connected to any Wi-Fi network");
    }
  } catch (error) {
    console.error("Error getting current Wi-Fi connection:", error);
  }
}

module.exports = getConnectedWifi;
