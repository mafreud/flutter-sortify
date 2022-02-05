# Container image that runs your code
FROM fischerscode/flutter:2.8.1

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

RUN sudo apt-get update -y
RUN sudo apt-get install -y sudo

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]