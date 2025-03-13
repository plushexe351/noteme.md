const axios = require("axios");

function startKeepAlive() {
  setInterval(async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/keep-alive");
      console.log(`KeepAlive: ${response.data}`);
    } catch (error) {
      console.error("KeepAlive Error:", error.message);
    }
  }, 15 * 60 * 1000); // Every 15 minutes
}

module.exports = startKeepAlive;
