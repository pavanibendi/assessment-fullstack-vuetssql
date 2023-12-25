#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MainStack } from "../lib";
import { stackPrefix } from "../aws-config";

const app = new cdk.App();

const environmentName = process.env.ENVIRONMENT_NAME || "staging";

if (environmentName === "development") {
  const stackName = `${stackPrefix}dev-stack`;
  new MainStack(app, stackName, {
    stackName,
    env: {
      account: "242219432226",
      region: "eu-west-1",
    },
    tags: {
      environmentName: "development",
    },
  });
}

if (environmentName === "staging") {
  const stackName = `${stackPrefix}stg-stack`;
  new MainStack(app, stackName, {
    stackName,
    env: {
      account: "242219432226",
      region: "eu-west-1",
    },
    tags: {
      environmentName: "staging",
    },
  });
}

if (environmentName === "production") {
  const stackName = `${stackPrefix}-stack`;
  new MainStack(app, stackName, {
    stackName,
    env: {
      account: "242219432226",
      region: "eu-west-1",
    },
    tags: {
      environmentName: "production",
    },
  });
}

app.synth();
