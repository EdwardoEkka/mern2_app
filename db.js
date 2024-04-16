const mongoose = require('mongoose');

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    mongoose.connect('mongodb+srv://vishalekka18:Edward123@cluster0.ezcpyyy.mongodb.net/chat?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        dbConnection = mongoose.connection;
        return cb(null); 
      })
      .catch((err) => {
        console.error(err);
        return cb(err); 
      });
  },
  getDb: () => dbConnection,
};
