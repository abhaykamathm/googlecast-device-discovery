# Device Discovery Service

This project is a Node.js application that continuously discovers devices on the local network using mDNS and Google Cast services. The discovered devices are saved to a JSON file and inserted into a database for further processing.

## Features

- Discover devices on the local network using mDNS (`node-dns-sd`).
- Identify Google Cast devices via `_googlecast._tcp.local`.
- Continuously scan and update the list of unique devices found on the network.
- Store device information in a JSON file and insert them into a database.
- Custom logic to filter out already discovered devices based on IP address.

## Prerequisites

- To be run only on linux
