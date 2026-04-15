FROM node:20-slim

WORKDIR /app

COPY resources/client ./resources/client
RUN cd resources/client && npm install && npm run build

COPY resources/server ./resources/server
RUN cd resources/server && npm install

WORKDIR /app/resources/server
CMD ["node", "index.js"]