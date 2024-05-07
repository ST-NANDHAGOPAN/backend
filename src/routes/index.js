function routes(app){
    app.use("/api/user" , require("./userRoutes"))
    app.use("/api/" , require("./authRoutes"))
}

module.exports = routes