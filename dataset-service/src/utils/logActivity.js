const axios = require("axios");

const logActivity = async (action, description, user) => {
    try {
        await axios.post(`${process.env.LOG_SERVICE_URL}/api/logs`, {
            action,
            description,
            userId: user?.id,
            username: user?.username,
            role: user?.role
        });
    } catch (err) {
        console.log("Log service unavailable");
    }
};

module.exports = logActivity;