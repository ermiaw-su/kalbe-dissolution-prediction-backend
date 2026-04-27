const axios = require('axios');

const logActivity = async (action, description, user) => {

    try {
        await axios.post(`${process.env.ACTIVITY_SERVICE_URL}/logs`, {
            action,
            description,
            userId: user?.id || null,
            username: user?.username || "system",
            email: user?.email || "system"
        });
    } catch (error) {
        console.log("Log Service Unavailable");
    }
};

module.exports = logActivity;