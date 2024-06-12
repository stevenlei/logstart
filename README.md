# logstart

**logstart** is a simple web server that logs all requests in detail to the console or a file. This includes the HTTP method, request path, headers, parameters, request payload, IP address, and timestamp.

## Features

- Logs detailed request information:
  - HTTP method
  - Request path
  - Headers
  - Parameters
  - Request payload
  - IP address
  - Timestamp
- Outputs logs to the console and optionally to a specified file.
- Automatically increments the port number if the specified port is occupied.
- Customizable response message.

## Usage

### Running the Server

To start the server, simply run:

```bash
npx logstart
```

By default, the server will run on port `8999`. If this port is occupied, it will automatically increment the port number until it finds an available one.

### Command Line Options

- `--output`, `-o`: Specify a file to save the log output.
- `--port`, `-p`: Specify the port for the web service. Defaults to `8999`.
- `--response`, `-r`: Specify a custom response message. Defaults to `{"status": "ok"}`.

### Examples

#### Start the Server with Default Settings

```bash
npx logstart
```

#### Save Logs to a File

```bash
npx logstart --output=logfile.txt
```

#### Specify a Custom Port

```bash
npx logstart --port=8080
```

#### Customize the Response Message

```bash
npx logstart --response='{"message": "Hello World"}'
```

### Example Output

When a request is made to the server, the log output is formatted with detailed information:

```
===================== 2024-06-12T12:34:56.789Z =====================
[GET] /
--------------------------------------------------------------------
[IP] ::1

[HEADERS]
{
  "host": "localhost:8999",
  "user-agent": "curl/7.64.1",
  ...
}

[PARAMS]
{}

[QUERY]
{}

[BODY]
{}

```

## License

This project is licensed under the MIT License.
