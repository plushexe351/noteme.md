const axios = require("axios");
require("dotenv").config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";

function startKeepAlive() {
  setInterval(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/keep-alive`);
      console.log(`KeepAlive: ${response.data}`);
    } catch (error) {
      console.error("KeepAlive Error:", error.message);
    }
  }, 15 * 60 * 1000);
}

module.exports = startKeepAlive;
