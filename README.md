# Marketplace

## Commande pour lancer le projet

Pour lancer le projet, exécutez la commande suivante :

docker-compose up -d


Cette commande nécessite Docker pour être installé.

## Conventions pour GIT

### Commits

Les noms des commits doivent suivre cette convention :

- **Feature:** `feature/(sujet) : sujet`
- **Correction:** `fix/(nomDeL'issue) : sujet`
- **Documentation:** `docs/(numéroDeL'issue) : sujet`

### Branches

Les noms des branches doivent être formatés comme suit :

- **Fonctionnalité:** `feature/${nomDeL'issue}`
- **Correction:** `fix/${nomDeL'issue}`
- **Documentation:** `docs/${numéroDeL'issue}`

### Demandes de fusion (Merge requests)

Les demandes de fusion doivent être adressées vers la branche `develop` et doivent être validées par un autre membre avant d'être fusionnées.
