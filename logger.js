const { createLogger, format, transports } = require("winston");
const axios = require("axios");

const sendLogToSigNoz = async (log) => {
  try {
    const response = await axios.post(
      "https://ingest.us.signoz.cloud:443/logs/json/",
      [log],
      {
        headers: {
          "Content-Type": "application/json",
          "signoz-access-token": "a893d527-40c9-406b-8f26-a0b8b3547b06",
        },
      }
    );
    console.log("Log sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending log:", error);
  }
};

const formatLog = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const logPayload = {
      timestamp: new Date(timestamp).getTime() * 1e6,
      trace_id: "000000000000000018c51935df0b93b9",
      span_id: "18c51935df0b93b9",
      trace_flags: 0,
      severity_text: level,
      severity_number: level === "info" ? 4 : 5,
      attributes: meta,
      resources: {
        host: "myhost",
        namespace: "prod",
      },
      body: message,
    };

    // Send log to SigNoz
    sendLogToSigNoz(logPayload);

    return JSON.stringify(logPayload);
  })
);

const logger = createLogger({
  level: "debug",
  format: format.combine(format.json(), formatLog),
  transports: [new transports.Console()],
  exitOnError: false,
});

logger.stream = {
  write: function (message) {
    logger.info(message.trim());
  },
};

module.exports = logger;
