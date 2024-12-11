# Usa l'immagine ufficiale di Node.js
FROM node:18

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file necessari nella directory di lavoro
COPY package.json package-lock.json ./
COPY ./src ./src
COPY ./public ./public

# Installa le dipendenze
RUN npm install

# Esegui la build del frontend
RUN npm run build

# Copia gli altri file del progetto (ad esempio il backend)
COPY . .

# Espone la porta
EXPOSE 3000

# Comando per avviare l'app
CMD ["npm", "start"]
