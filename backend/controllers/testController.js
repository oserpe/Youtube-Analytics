const { testServiceFoo } = require("../services/testService");

function testControllerFoo(req, res, next) {
    console.log("in controller, foo function");
    testServiceFoo();
    res.send({
        data: {
            user: "test",
            id: 1
        }
    });
}

function testControllerBar(req, res, next) {
    console.log("in controller, bar function");
    const { test } = req.body;
    if (test)
        res.send({
            data: {
                received: test
            }
        });
    else {
        const error = new Error("No data was received");
        error.status = 400;
        next(error); 
    } 
        
}

module.exports = {
    testControllerFoo,
    testControllerBar,
}