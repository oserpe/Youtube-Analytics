const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// TODO: agregar winston logger

app.use(bodyParser.json());

require("./routes/testRoutes")(app);

// este es el endpoint "/..." (donde cae todo lo que no matchee)
app.use((req, res, next) => {
    const error = new Error("Endpoint does not exists");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({message});
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`SERVER LISTENING ON PORT ${port}`);
})

