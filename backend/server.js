const http = require('http');
const app = require("./api/api");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port,()=>{
    console.log(`Server is up at ${port}`);
});


