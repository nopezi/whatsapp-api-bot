FROM debian:bullseye as builder

# ARG NODE_VERSION=16.18.0
# ARG YARN_VERSION=1.22.19
# ARG YARN_VERSION=4.0.0-rc.40

RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh
RUN source ~/.bashrc
RUN nvm install v16.18.0
RUN nvm use v16.18.0

RUN apt-get update; apt install -y curl python-is-python3 pkg-config build-essential
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
# RUN volta install node@${NODE_VERSION} yarn@${YARN_VERSION}
# RUN volta install node@${NODE_VERSION}

# RUN npm install 
# RUN npm install yarn@1.22.19

#######################################################################

RUN mkdir /app
WORKDIR /app

# Yarn will not install any package listed in "devDependencies" when NODE_ENV is set to "p>
# to install all modules: "yarn install --production=false"
# Ref: https://classic.yarnpkg.com/lang/en/docs/cli/install/#toc-yarn-install-production-t>

ENV NODE_ENV production

COPY . .

RUN yarn install
FROM debian:bullseye

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

CMD [ "yarn", "run", "start" ]