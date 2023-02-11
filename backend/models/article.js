// Importation des models et des plugin nécessaire 
const mongoose = require('mongoose');
// Le schema de la table de article de la base de donnée 
const articleSchema = mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true }
});

module.exports = mongoose.model('Article', articleSchema);