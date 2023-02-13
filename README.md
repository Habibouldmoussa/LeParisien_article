# article_lp_api

## Authors

- [@OULDMOUSSA HABIB](https://ouldmoussahabib.com)

## API Reference

- Endpoint permettant la liste des articles

```
 Get : /articles/
```

- Endpoint permettant la recherche d'un articles avec le slug de l'article

```
 Get : /articles/q/:slug
```

- Endpoint permettant la creation d'articles

```
 Post : /articles/
```

- Endpoint permettant la récuperation d'un article par son ID

```
 Get : /articles/:id
```

- Endpoint permettant la modification d'un article par son ID

```
 Put : /articles/:id
```

- Endpoint permettant de supprimer un article par son ID

```
 Delete : /articles/:id
```

- Endpoint permettant de se loger a l'admin

```
/users/login
```

## Deployment

```
$ cd backend
$ npm run start
```

.env :

```
PORT= 4200
MONGODB_URL = "lien de connexion a votre base de donnée"
LOGIN = "login admin"
PASS = "pass admin"
APP_SECRET="chaine de caractaire pour encoder le token"
```

lien de l'api :

```
http://localhost:4200/
```
