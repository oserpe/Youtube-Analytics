const e = require("express");
const { testServiceFoo } = require("../services/testService");

function testControllerFoo(req, res, next) {
    console.log("in controller");
    testServiceFoo();
    res.send({
        data: {
            user: "test",
            id: 1
        }
    });
}

module.exports = {
    testControllerFoo,
}