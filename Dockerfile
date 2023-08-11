FROM node:alpine
ENV NODE_ENV=production
WORKDIR /app
COPY . /app
RUN npm install --production
COPY . .
EXPOSE 81
CMD ["npm", "start"]