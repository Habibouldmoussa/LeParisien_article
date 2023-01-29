// Importation des models et des plugin nécessaire 
const article = require('../models/article');
const fs = require('fs');
//-----------------------------------------------
// Création des articles 
exports.createArticle = (req, res, next) => {
    const articleObject = JSON.parse(req.body.article);
    console.log(req.body.article)
    //const articleObject = JSON.parse(req.body);
    // on supprime les données redondente 
    delete articleObject._id;
    //delete articleObject._userId;
    // On verifie si le multer renvoi un fichier valide sinon on remplace par une image par default 
    let filename = (req.file != undefined) ? req.file.filename : 'default.jpg';
    const article = new article({
        ...articleObject,
        //userId: req.auth.userId,
        image: `${req.protocol}://${req.get('host')}/images/${filename}`
    });
    // On sauvgarde l'article dans la base de donnée 
    article.save()
        .then(() => { res.status(201).json({ message: 'article enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};
// Récuperation d'une seule article
exports.getOneArticle = (req, res, next) => {
    article.findOne({ _id: req.params.id })
        .then(article => res.status(200).json(article))
        .catch(error => res.status(404).json({ error: error }));
};
// Modification de l'article
exports.modifyArticle = (req, res, next) => {
    //On vérifie si une image est uploadée 
    const articleObject = req.file && req.file != undefined ? {
        ...JSON.parse(req.body.article),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete articleObject._userId;
    article.findOne({ _id: req.params.id })
        .then((article) => {
            if (article.userId != req.auth.userId) {
                res.status(403).json({ message: 'unauthorized request' });
            } else {
                if (req.file) {
                    const filename = article.imageUrl.split('/images/')[1];
                    // on verifie si l'image uplaudée n'est pas une image par defaut 
                    if (filename != 'default.jpg') {
                        // On supprime l'ancienne image 
                        fs.unlink(`images/${filename}`, (err) => {
                            if (err) { console.log(err); }
                        });
                    }
                }
                // On update l'article dans la base de donnée 
                article.updateOne({ _id: req.params.id }, { ...articleObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'article modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};
// suppression de l'article 
exports.deleteArticle = (req, res, next) => {
    article.findOne({ _id: req.params.id })
        .then(article => {
            if (article.userId != req.auth.userId) {
                res.status(403).json({ message: 'unauthorized request' });
            } else {
                const filename = article.imageUrl.split('/images/')[1];
                // On verifie si l'image est pas l'image par defaut
                if (filename != 'default.jpg') {
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) { console.log(err); }
                    });
                }
                //supprime de la base de donnée 
                article.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'article supprimé !' }) })
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};
// On affiche la totalité des articles de la base de donnée
exports.getAllArticle = (req, res, next) => {
    article.find()
        .then(articles => res.status(200).json(articles))
        .catch(error => res.status(400).json({ error: error }));
};