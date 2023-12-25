#!/bin/bash
docker tag jdwly-api:latest 242219432226.dkr.ecr.eu-west-1.amazonaws.com/jdwly-api-circleci:1-local
docker push 242219432226.dkr.ecr.eu-west-1.amazonaws.com/jdwly-api-circleci:1-local