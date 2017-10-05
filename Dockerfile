FROM node:alpine

# Some meta
LABEL author="WRAH LLC"
LABEL maintainer.name="Enrique Howard-Tillit"
LABEL maintainer.email="contact@wrahllc.com"
LABEL version="0.0.2"
LABEL description="This is the base container for all of our React apps."

# Just to be safe
RUN apk add --no-cache libc6-compat

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV=development

EXPOSE 3000
CMD [ "/bin/sh", "/usr/src/app/bin/development_entrypoint.sh" ]
