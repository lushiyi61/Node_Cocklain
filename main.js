var TarsServer  = require("./protal.js").server;
var TarsGame = require("./tars/TarsGameImp").TarsGame;

var tarsLogs = require("@tars/logs");
var logger = new tarsLogs('TarsDate');

var svr = new TarsServer();
svr.initialize(process.env.TARS_CONFIG || "./JFGame.NodeCocklain.config.conf", function (server){
    server.addServant(TarsGame.IGameMessageImp, server.Application + "." + server.ServerName + ".CocklainObj");
    logger.info("==============Cocklain server started=================");
});
svr.start();
