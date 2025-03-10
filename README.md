# Secured Webshop
Ce repository est utilisé dans le cadre du projet Secure Webshop pour le cours 183 - Sécurité des applications.

## Démarrer le projet
Création du fichier .env (copier-coller le fichier exemple et renommer le fichier en .env)

1. Exécutez la commande suivante pour démarrer :
## *Dans un Bash* 
## Si vous devez générer des fichiers SSL :
```bash
cd ssl/
openssl genrsa -out server.key 2048  
openssl req -new -key server.key -out server.cert
openssl x509 -req -days 365 -in server.cert -signkey server.key -out server.cert  
```
 ## Containers Docker :  
   ```bash
   cd ../ 
   docker-compose up --build
   ```
## Connectez-vous à la base de données :
  ```bash
  docker exec -it db mysql -u root -proot
  ```
## Créez la base de données :
```
CREATE DATABASE db_TechSolutions;
exit
```

## Page de démarrage
https://localhost:443/login
