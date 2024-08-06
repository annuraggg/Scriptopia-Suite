FROM amazonlinux:latest

RUN yum install -y gcc zip

COPY . /src
WORKDIR /src

RUN gcc -o driver driver.c
