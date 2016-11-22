var isNamedConnection = false
  , expose = function(db, sequelize, models, options){
    // Expose the sequelize object
    if(options.name) {

      if(isNamedConnection == false) {
        isNamedConnection = true;

        // Namespace sequelize
        if(db.sequelize) {
          var namespace = { 'default': db.sequelize };
          db.sequelize = namespace;
        } else {
          db.sequelize = {};
        }

        // Namespace models
        if(db.models) {
          var namespace = { 'default' : db.models };
          db.models = namespace;
        }
      }

      // Add namespaced sequelize and models
      db.sequelize[options.name]  = sequelize;
      db.models[options.name]     = models;
    } else if(isNammedConnection) {
      throw "If any of your connections are named, then all of them must be";
    } else {
      // Default to non-namespaced db
      db.sequelize = sequelize;
      db.models    = models;
    }

    return db;
  };


module.exports = expose;
