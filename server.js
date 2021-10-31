
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fs = require("fs")
const PORT = process.env.PORT;


// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();



     
  // All remaining requests return the React app, so it can handle routing.
  app.use(express.static(path.resolve(__dirname, 'build')));

  
  app.get('*', function (request, response) {
  
  
    const filePath = path.resolve(__dirname, 'build', 'index.html')
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
         
      }
      response.send(data);
    });
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}