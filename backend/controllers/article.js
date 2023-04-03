// Importation des models et des plugin nécessaire 
const Article = require('../models/article');
const fs = require('fs');
const apicache = require('apicache')
let cache = apicache.middleware
//-----------------------------------------------

/* Création des articles 
*@param { object HTTP  } req
*@property { binary } req.file - l'image uplouadée
*@property { JSON } req.body.Article - l'article 
*@param { object HTTP } res 
*@param { String } next
*@return { JSON } Message
*/
exports.createArticle = (req, res, next) => {
    const articleObject = JSON.parse(req.body.Article);
    console.log(articleObject)
    // On verifie si le multer renvoi un fichier valide sinon on remplace par une image par default  
    let filename = (req.file != undefined) ? req.file.filename : 'default.png';
    const article = new Article({
        ...articleObject,
        image: `${req.protocol}://${req.get('host')}/images/${filename}`
    });
    // On sauvgarde l'article dans la base de donnée 
    article.save()
        .then(() => { res.status(201).json({ message: 'article enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })

};

/* Récuperation d'une seule article
*@param { object HTTP  } req
*@property { String } req.params.id - l'id de l'article a afficher*
*@param { object HTTP } res 
*@param { String } next
*@return { JSON } article
*/
exports.getOneArticle = (req, res, next) => {
    Article.findOne({ _id: req.params.id })
        .then(article => res.status(200).json(article))
        .catch(error => res.status(404).json({ error: error }));
};

/* Modification de l'article
*@param { object HTTP  } req
*@property { binary } req.file - l'image uplouadée
*@property { JSON } req.body.Article - l'article 
*@property { String } req.params.id - l'id de l'article a afficher*
*@param { object HTTP } res 
*@param { String } next
*@return { JSON } message
*/
exports.modifyArticle = (req, res, next) => {
    //console.log(req)
    //On vérifie si une image est uploadée 
    const articleObject = req.file && req.file != undefined ? {
        ...JSON.parse(req.body.Article),
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // s'il existe une image uploader on ajoute le lien
    } : { ...JSON.parse(req.body.Article) }; // sinon on modifie seulement l'article 
    Article.findOne({ _id: req.params.id })
        .then((article) => {

            if (req.file) {
                const filename = article.image.split('/images/')[1];
                // on verifie si l'image uplaudée n'est pas une image par defaut 
                if (filename != 'default.png') {
                    // On supprime l'ancienne image 
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) { console.log(err); }
                    });
                }
            }
            // On update l'article dans la base de donnée 
            Article.updateOne({ _id: req.params.id }, { ...articleObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'article modifié!' }))
                .catch(error => res.status(401).json({ error }));
            cache.clear()
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}
/*suppression de l'article 
*@param { object HTTP  } req
*@property { String } req.params.id - l'id de l'article a afficher*
*@param { object HTTP } res 
*@param { String } next
*@return { JSON } message
*/
exports.deleteArticle = (req, res, next) => {
    // on récupere l'article à supprimer
    Article.findOne({ _id: req.params.id })
        .then(article => {
            const filename = article.image.split('/images/')[1];
            // On verifie si l'image est pas l'image par defaut
            if (filename != 'default.png') {
                //console.log(filename)
                fs.unlink('images/' + filename, (err) => {
                    if (err) { console.log(err); }
                });
            }
            //supprime de la base de donnée 
            Article.deleteOne({ _id: req.params.id })
                .then(() => { res.status(200).json({ message: 'article supprimé !' }) })
                .catch(error => res.status(401).json({ error }));
            cache.clear()
        }).catch(error => {
            res.status(500).json({ error });
        });
};

/* On affiche la totalité des articles de la base de donnée
*@param { object HTTP  } req
*@param { object HTTP } res 
*@param { String } next
*@return { JSON } articles
*/
exports.getAllArticle = (req, res, next) => {
    Article.find()
        .then(articles => res.status(200).json(articles))
        .catch(error => res.status(400).json({ error: error }));
};
/* On affiche la totalité des articles avec le slug comme requette 
*@param { object HTTP  } req
*@property { String } req.params.slug - le slug de l'article recherché 
*@param { object HTTP } res 
*@param { String } next
*@return { JSON } articles
*/
exports.getArticleBySlug = (req, res, next) => {
    Article.find({ slug: req.params.slug })
        .then(articles => res.status(200).json(articles))
        .catch(error => res.status(400).json({ error: error }));
};