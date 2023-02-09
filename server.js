const http = require("http");

const port = 3000;

// Creates a server object
http
  .createServer((request, response) => {
    const url = request.url;
    const method = request.method;
    response.setHeader("Content-Type", "text/html");

    console.log("Request made with this method: ", request.method);
    const dataChunksArray = [];

    request.on("data", (chunk) => {
      console.log("Chunk", chunk);
      dataChunksArray.push(chunk);
    });
    request.on("end", () => {
      // Handle all of the POST requests in this function
      const body = JSON.parse(Buffer.concat(dataChunksArray).toString());
      const responseBody = { method, url, body };

      if (url == "/") {
        response.writeHead(200, "OK");
        response.write("<h1>Message Received</h1>");
      } else if (url == "/echo") {
        response.writeHead(200, "OK");
        response.write(JSON.stringify(responseBody));
      }

      response.write(JSON.stringify(responseBody));
      response.end();
    });
    if (url == "/") {
      if (method == "GET") {
        response.write("<h1>Home: Paul's Pad</h1");
        response.statusCode = 200;
        response.end();
      }
    } else if (url == "/about") {
      response.statusCode = 200;
      response.write("About - I am Paul");
      response.end();
    } else if (url == "/contact") {
      response.statusCode = 200;
      response.write("<h1>Contact Me: paul@fakemail.net</h1");
      response.end();
    }
  })
  .listen(port, () => {
    console.log("Server listening on port: " + port);
  });
