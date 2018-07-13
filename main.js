var TarsServer  = require("./protal.js").server;
var TarsNode = require("./tars/NodeMessageImp.js").NodeMessage;

var svr = new TarsServer();
svr.initialize(process.env.TARS_CONFIG || "./TARS.NodeTarsServer.config.conf", function (server){
    server.addServant(TarsNode.MessageImp, server.Application + "." + server.ServerName + ".CocklainObj");
    console.log("Cocklain server started");
});
svr.start();
