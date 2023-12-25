#!/bin/bash
aws ecr get-login-password --profile jdwly | docker login --username AWS --password-stdin 242219432226.dkr.ecr.eu-west-1.amazonaws.com
