const fs = require("fs");
const express = require("express");

//Add some data to a file
const heroData = {
  heros: [
    {
      id: 0,
      name: "Ironman",
      catchphrase: "I am Ironman",
      isGood: true,
    },
    {
      id: 1,
      name: "Gandalf",
      catchphrase: "You shall not pass",
      isGood: true,
    },
  ],
};
let nextId = heroData.heros.length;
fs.writeFile("heros.json", JSON.stringify(heroData), (err) => {
  if (err) console.err(err);
  console.log("Wrote data to the hero file");
});

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  console.log("Attempting to handle the home GET point");
  res.write("<h1>Home: Paul's Pad</h1>");
  res.status(200);
  res.end();
});

server.get("/heros", (req, res) => {
  console.log("Attempting to handle the heros GET endpoint");
  fs.readFile("heros.json", (err, data) => {
    if (err) console.err(err);

    res.json(JSON.parse(data));
    res.end();
  });
});
server.post("/heros", (req, res) => {
  console.log("Attempting to handle the heros POST endpoint");
  console.log(req.body);

  //Read the file contents
  fs.readFile("heros.json", (err, data) => {
    if (err) throw err;

    const parsedData = JSON.parse(data);
    console.log("parsedData:", parsedData);
    //Generate the new id for the new hero
    //const newId = parsedData.heros[parsedData.heros.length - 1].id + 1;
    const newHero = {
      id: nextId++,
      ...req.body,
    };
    parsedData.heros.push(newHero);
    console.log("new data:", parsedData);

    //Insert the new data into the file's data
    fs.writeFile("heros.json", JSON.stringify(parsedData), (err) => {
      if (err) throw err;

      console.log(`Wrote ${newHero.name} into the file`);
      res.end(`Updated heros files to include ${newHero.name}`);
    });
  });
});
server.post("/echo", (req, res) => {
  console.log("Attempting to handle post?");
  const responseBody = { body: req.body, url: req.url, method: req.method };

  res.status(200);
  res.json(responseBody);
  //   res.write(JSON.stringify(responseBody));
  res.end();
});

server.listen(3000, () => {
  console.log("Server started at localhost:3000");
});
