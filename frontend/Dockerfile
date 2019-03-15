# base image
FROM node:10.15.1

# set working directory
# RUN mkdir frontend
# RUN mkdir /frontend/scr
# WORKDIR /frontend

# add `/frontend/scr/` to $PATH
#ENV PATH /frontend/src/:$PATH

# install and cache app dependencies
WORKDIR /frontend_app
COPY package.json .

RUN npm install --silent
#RUN npm install react-scripts@1.1.5 -g --silent

COPY . .

#WORKDIR /src

# start app
CMD ["npm", "start"]