const axios = require('axios');

const logActivity = async (action, description, user) => {
    try {
        await axios.post(`${process.env.ACTIVITY_SERVICE_URL}/api/logs`, {
                action,
                description,
                userId: user?.id || null,
                doneBy: user?.username || "system",
                role: user?.role || "system"
        });
    } catch (error) {
        console.log("Log Service Unavailable");
    }
};

module.exports = logActivity;