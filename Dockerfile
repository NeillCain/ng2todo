FROM mhart/alpine-node

COPY package.json /src/package.json
RUN cd /src && npm i --production
COPY public /src/public/
COPY server.js /src/
EXPOSE 8080
CMD ["node", "/src/server.js"]