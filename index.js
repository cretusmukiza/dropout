const express = require("express"),
  csv = require("csvtojson"),
  cors = require("cors"),
  multer = require("multer"),
  path = require("path"),
  fs = require("fs"),
  bodyParser = require("body-parser"),
  app = express(),
  port = process.env.PORT || 5000,
  mongoose = require("mongoose"),
  User = require("./model");
// For jsdom version 10 or higher.
// Require JSDOM Class.
const JSDOM = require("jsdom").JSDOM;
// Create instance of JSDOM.
const jsdom = new JSDOM('<body><div id="container"></div></body>', {
  runScripts: "dangerously"
});
// Get window
const window = jsdom.window;
var anychart = require("anychart")(window);
var anychartExport = require("anychart-nodejs")(anychart);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./files");
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      }
    })
  }).single("dropouts")
);
const root = path.join(__dirname, "visual", "build");
app.use(express.static(root));
app.get("/template", (req, res) => {
  const file = path.join(__dirname, "template.csv");
  res.download(file);
});
app.post("/bar", async (req, res) => {
  console.log(req.body);
  const { year, data } = req.body;
  const viewData = [];
  for (region of data) {
    viewData.push({
      x: region.region,
      value: region.total_dropout
    });
  }
  let chart = anychart.column(viewData);
  chart.title(`A graph of total dropout vs region in year ${year}`);
  chart.bounds(0, 0, 900, 550);
  chart.container("container");
  chart.draw();
  try {
    let image = await anychartExport.exportToSync(chart, "pdf");
    await fs.writeFileSync("region.pdf", image);
    let file = path.join(__dirname, "region.pdf");
    res.download(file);
  } catch (err) {
    res.status(500).send({ message: "Failed to save file" });
    console.log(err)
  }
});
app.post("/dis", async (req, res) => {
  console.log(req.body);
  const { year, data, region } = req.body;
  const viewData = [];
  for (dis of data) {
    if (region[0] !== "COUNCIL") {
      viewData.push({
        x: dis[1],
        value: dis[2],
        size: dis[3],
        region: dis[0]
      });
    }
  }
  let chart = anychart.bubble(viewData);
  chart.title(`Dropouts in  districts of ${region} region in ${year}`);
  chart.bounds(0, 0, 900, 550);
  chart.container("container");
  chart.labels(true);
  // format labels
  chart.labels().format("{%region}");
  chart.xAxis().title("Total Enrollment");
  chart.yScale(anychart.scales.linear());
  chart.draw();
  try {
    let image = await anychartExport.exportToSync(chart, "pdf");
    console.log(image)
    await fs.writeFileSync("dis.pdf", image);
    let file = path.join(__dirname, "dis.pdf");
    res.download(file);
  } catch (err) {
    res.status(500).send({ message: "Failed to save file" });
    console.log(err)
  }
});
app.post("/gender", async (req, res) => {
  console.log(req.body);
  const { year, data } = req.body;
  const viewData = [];
  for (region of data) {
    viewData.push([
      region.region,
      parseInt(region.dropout_female),
      parseInt(region.dropout_male)
    ]);
  }
  let chartData = {
    title: `A graph of male and female dropout vs region in year ${year}`,
    header: ["#", "Dropout Female", "Dropout Male"],
    rows: viewData
  };
  let chart = anychart.column();
  chart.data(chartData);
  chart.bounds(0, 0, 900, 550);
  chart.legend().enabled(true);
  chart.container("container");
  chart.draw();
  try {
    let image = await anychartExport.exportToSync(chart, "pdf");
    await fs.writeFileSync("gender.pdf", image);
    let file = path.join(__dirname, "gender.pdf");
    res.download(file);
  } catch (err) {
    res.status(500).send({ message: "Failed to save file" });
    console.log(err)
  }
});
app.post("/dropouts", async (req, res) => {
  try {
    const json = await csv().fromFile(`./files/${req.file.originalname}`);
    console.log(json);
    res.send(json);
  } catch (err) {
    console.log(err);
  }
});
app.route("/registerUser").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    await new User({ email, password }).save();
    res.status(200).send(true);
  } catch (err) {
    res.status(500).send(false);
  }
});
app.route("/loginUser").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).send(true);
    }
    else{
      res.status(500).send(false);
    }
  } catch (err) {
    console.log(error)
  }
});
app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});
mongoose
  .connect(
    `mongodb://cocoacodes:cocoacodes2019@cluster0-shard-00-00-kn4eb.mongodb.net:27017,cluster0-shard-00-01-kn4eb.mongodb.net:27017,cluster0-shard-00-02-kn4eb.mongodb.net:27017/drop?ssl=true&territory representativelicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected");
  })
  .catch(err => {
    console.log(err);
  });
app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
