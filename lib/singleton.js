"use strict";

var path      = require("path")
  , Sequelize = require("sequelize")
  , dive      = require("./dive")
  , expose    = require("./expose")
  , db        = {}
  , log       = function(log){
    if(typeof db.logger === 'function')
      db.logger(log);
  };


db.Sequelize = Sequelize; // Expose Sequelize
db.models = {};           // Expose models

db.discover = ["/model"]; // Set the default discovery paths
db.matcher  = null;       // Set matcher to null

// Define default logger function
db.logger   = function(log){
  console.log(log);
};

// Expose the connection function
db.connect = function(database, username, password, options, connectionOptions = {}) {

  log("Connecting to: " + database + " as: " + username);

  // Instantiate a new sequelize instance
  var sequelize = new db.Sequelize(database, username, password, options)
    , discover  = connectionOptions.discover || db.discover
    , models = {};

  discover.forEach(function(location){

    // Recurse through the api directory and collect the models
    dive(location, function(err, path) {

      log("Loading Model: "+ path.substring(path.lastIndexOf("/") + 1));

      var model = sequelize["import"](path);

      if(model)
        models[model.name] = model;
    }, db.matcher);
  });

  // Execute the associate methods for each Model
  Object.keys(models).forEach(function(modelName) {

    if ("associate" in models[modelName]) {

      log("Associating Model: "+ modelName);

      models[modelName].associate(models);
    } else {
      log("Nothing to associate for Model: "+ modelName);
    }
  });

  expose(db, sequelize, models, connectionOptions);

  log("Finished Connecting");

  return true;
};

module.exports = db;
