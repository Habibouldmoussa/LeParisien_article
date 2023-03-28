// Importation des models et des plugin nécessaire 
const mongoose = require('mongoose');
// Le schema de la table de article de la base de donnée 
const articleSchema = mongoose.Schema({
    time: { type: String, required: true },
    aquis: { type: String, required: true },

});

module.exports = mongoose.model('Article', articleSchema);