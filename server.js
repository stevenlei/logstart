#!/usr/bin/env node

const express = require("express");
const yargs = require("yargs");
const fs = require("fs");
const os = require("os");
const net = require("net");
const chalk = require("chalk");
const stripAnsi = require("strip-ansi");
const path = require("path");

// Parse command line arguments
const argv = yargs
  .option("output", {
    alias: "o",
    description: "Save output to a specific path",
    type: "string",
  })
  .option("port", {
    alias: "p",
    description: "Port for the web service",
    type: "number",
    default: 8999,
  })
  .option("response", {
    alias: "r",
    description: "Response message",
    type: "string",
    default: `{"status": "ok"}`,
  })
  .help()
  .alias("help", "h").argv;

let output = argv.output;

// check if the output path is writable
if (output) {
  // compose the full path
  if (!path.isAbsolute(output)) {
    output = path.join(process.cwd(), output);
  } else {
    output = path.resolve(output);
  }

  // Check if the output path is writable by creating a file
  try {
    if (!fs.existsSync(output)) {
      fs.writeFileSync(output, "");
    } else {
      fs.accessSync(output, fs.constants.W_OK);
    }

    console.log(chalk.green(`Output will be saved to ${output}`));
  } catch (err) {
    console.error(chalk.red(`Output path ${output} is not writable`));
    process.exit(1);
  }
}

const app = express();
let port = argv.port;

// Middleware to parse JSON data
app.use(express.json());

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));

// Middleware to log requests
app.use((req, res, next) => {
  const logData = {
    method: req.method,
    path: req.path,
    headers: req.headers,
    params: req.params,
    query: req.query,
    body: req.body,
    ip: req.ip,
    time: new Date().toISOString(),
  };

  let logMessage = [];

  logMessage.push(
    `===================== ${logData.time} =====================`
  );
  logMessage.push(
    `${chalk.bgGreen.black(`[${logData.method}]`)} ${chalk.bold(logData.path)}`
  );
  logMessage.push(
    "--------------------------------------------------------------------"
  );

  logMessage.push(`${chalk.inverse(`[IP]`)} ${chalk.bold(logData.ip)}`);
  logMessage.push("");
  logMessage.push(chalk.inverse("[HEADERS]"));
  logMessage.push(JSON.stringify(logData.headers, null, 2));
  logMessage.push("");
  logMessage.push(chalk.inverse("[PARAMS]"));
  logMessage.push(JSON.stringify(logData.params, null, 2));
  logMessage.push("");
  logMessage.push(chalk.inverse("[QUERY]"));
  logMessage.push(JSON.stringify(logData.query, null, 2));
  logMessage.push("");
  logMessage.push(chalk.inverse("[BODY]"));
  logMessage.push(JSON.stringify(logData.body, null, 2));
  logMessage.push("");
  logMessage.push(os.EOL);

  console.log(logMessage.join(os.EOL));

  // Optionally save to file
  if (output) {
    fs.appendFileSync(output, stripAnsi(logMessage.join(os.EOL)));
  }

  next();
});

app.get("*", (req, res) => {
  try {
    res.json(JSON.parse(argv.response));
  } catch (error) {
    res.send(argv.response);
  }
});

// Check if a port is available
const checkPort = (port, callback) => {
  const server = net.createServer();
  server.unref();
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      callback(false);
    } else {
      callback(err);
    }
  });
  server.listen(port, () => {
    server.close(() => {
      callback(true);
    });
  });
};

// Start the server with the first available port
const startServer = (port) => {
  checkPort(port, (available) => {
    if (available === true) {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } else {
      console.log(`Port ${port} is occupied, trying port ${port + 1}`);
      startServer(port + 1);
    }
  });
};

startServer(port);
