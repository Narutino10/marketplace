const express = require('express');

//bases de données
const db = require('./config/postgres');
const mongodb = require('./config/mongodb');

const cors = require('cors');
const bodyParser = require("body-parser");
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/error_handler');
const { geocodeAddress } = require('./utils/geocodeService');


//routes
const authRoutes = require('./routes/api/auth');
const products = require('./routes/api/products')
const uploadRoutes = require('./routes/api/uploadRoute')
const sectionRoutes = require('./routes/api/MenuRoute');
const cartRoutes = require('./routes/api/PanierRoute');
const orderRoutes = require('./routes/api/CommandeRoutes');
const FavoriteRoutes = require('./routes/api/FavoriteRoutes');
const AddressRoutes = require('./routes/api/adresseRoutes');
const PaymentRoutes = require('./routes/api/PaymentRoutes');
const ReturnRoutes = require('./routes/api/ReturnsRoutes');
const stripeRoutes = require('./routes/api/stripeRoutes');


const cron = require('node-cron');
const upload = require('./middleware/upload');
const cookieParser = require('cookie-parser');
const { checkPasswordRenewal } = require('./services/reset_mail');
//import injectProducts from './utils/faker';
const path = require('path');


require('dotenv').config();

async function init() {
    await checkPasswordRenewal();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(credentials);
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', products);
app.use('/api/upload', uploadRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', FavoriteRoutes);
app.use('/api/addresses', AddressRoutes);
app.use('/api/payments', PaymentRoutes);
app.use('/api/returns', ReturnRoutes);
app.use('/api/stripe', stripeRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



cron.schedule('0 0 * * *', checkPasswordRenewal);

app.get('/geocode', async (req, res) => {
    const address = req.query.q;

    if (!address) {
        return res.status(400).json({ error: 'Address query parameter is required' });
    }

    try {
        const results = await geocodeAddress(address);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error });
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});


app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
    //init();
});


//injectProducts();

process.on("unhandledRejection", err => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
