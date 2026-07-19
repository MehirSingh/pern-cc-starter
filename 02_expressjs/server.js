import express from 'express';

const app = express();
const port = 3000; 

const router = express.Router()

app.use(express.json());

// middleware adding
app.use((req, res, next) =>{
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.url}`);
        next();
});

let cars = [
    {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 28000
    },
        {
        id: 2,
        make: 'Audi',
        model: 'Q8',
        year: 2021,
        price: 25000
    },
        {
        id: 3,
        make: 'BMW',
        model: 'M3gtr',
        year: 2020,
        price: 29000
    }
]

app.get('/', (req,res) =>{
    res.send('Hello from the cars');
});

router.get('/', (req, res) =>{
    res.json(cars);
})

router.post('/', (req, res) => {
    const {make, model, year, price} = req.body;

    if (!make || !model || !year || !price){
        return res.status(400).json({error : "Missing Fields"})
    }

    const newCar = {
        id: cars.length+1,
        make,
        model,
        year: Number(year),
        price: Number(price)
    }
    cars.push(req.body);
    res.status(201).json(newCar)
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = cars.findIndex(c => c.id === id)
    if (index === -1){
        return res.status(404).json({error:"Not found"});
    }

    const {make, model, year, price} = req.body;

    if (make) cars[index].make = make;
    if (model) cars[index].model = model;
    if (year) cars[index].year = Number(year);
    if (price) cars[index].year = Number(price);

    res.json(cars[index])
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const car = cars.find((car) => car.id==id);
     
    res.send("Delete car");
});

//params is string by default so convert it to numbers
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const car = cars.find((car) => car.id == id); //returns true or false

    if(!car) return res.status(404).send('Cars not found');
    res.json(car);
});

app.use('/api/v1/cars', router);

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));