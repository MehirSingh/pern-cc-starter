import express from "express";
import { db } from "./db.js";
import { Cars } from "./schema.js"

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from Car API!");
});

router.get("/Cars", async(req, res) => {
  const allCars = await db.select().from(Cars);
  res.json(allCars);
});

router.post("/Cars", async (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({
      error: "Please provide make, model, year, and price",
    });
  }

const [newCar] = await db.insert(Cars).values({make, model, year, price}).returning();

res.status(201).json(newCar);
});

router.put("/Cars/:id", (req, res) => {
  const carId = parseInt(req.params.id);
  const carIndex = Cars.findIndex((c) => c.id === carId);

  if (carIndex === -1) {
    return res.status(404).json({ error: "Car not found" });
  }

  const { make, model, year, price } = req.body;

  if (make) Cars[carIndex].make = make;
  if (model) Cars[carIndex].model = model;
  if (year) Cars[carIndex].year = parseInt(year);
  if (price) Cars[carIndex].price = parseFloat(price);

  res.json(Cars[carIndex]);
});

router.delete("/Cars/:id", (req, res) => {
  const carId = parseInt(req.params.id);
  const carIndex = Cars.findIndex((c) => c.id === carId);

  if (carIndex === -1) {
    return res.status(404).json({ error: "Car not found" });
  }

  const deletedCar = Cars.splice(carIndex, 1)[0];

  res.json({
    message: "Car deleted successfully",
    car: deletedCar,
  });
});

router.get("/Cars/:id", (req, res) => {
  const carId = parseInt(req.params.id);
  const car = Cars.find((c) => c.id === carId);

  if (!car) {
    return res.status(404).json({ error: "Car not found" });
  }

  res.json(car);
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
