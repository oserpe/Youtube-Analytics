const testController = require("../controllers/testController");

module.exports = app => {
    app.get("/test", testController.testControllerFoo);
    app.post("/test", testController.testControllerBar)
}