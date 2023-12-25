// import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { CfnService } from "aws-cdk-lib/aws-apprunner";
import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

interface Props {
  serviceName: string;
  imageRepoName: string;
  // vpc: ec2.IVpc;
  // securityGroup: ec2.ISecurityGroup;
  databaseSecretName: string;
  databaseHost: string;
  accessKeyId: string;
  accessKeySecretValue: secretsmanager.ISecret;
  environmentName: string;
}

export class AppRunner extends Construct {
  constructor(
    scope: Construct,
    id: string,
    {
      serviceName,
      imageRepoName,
      // vpc,
      // securityGroup,
      databaseSecretName,
      databaseHost,
      accessKeyId,
      accessKeySecretValue,
      environmentName,
    }: Props
  ) {
    super(scope, id);
    // secret
    const databaseCredentials = secretsmanager.Secret.fromSecretNameV2(
      this,
      `${serviceName}-credentials`,
      databaseSecretName
    );
    // create vpc connector
    // const vpcConnectorName = `${serviceName}-vpc-connector`;
    // const vpcConnector = new apprunner.VpcConnector(this, vpcConnectorName, {
    //   vpc,
    //   vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
    //   vpcConnectorName,
    //   securityGroups: [securityGroup],
    // });
    // create jwt secret
    const jwtSecret = new secretsmanager.Secret(this, `${serviceName}-jwt`, {
      secretName: `${serviceName}-jwt`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: "JWT_SECRET",
      },
    });

    // create service
    const service = new apprunner.Service(this, serviceName, {
      serviceName,
      source: apprunner.Source.fromEcr({
        imageConfiguration: {
          port: 8080,
          environmentSecrets: {
            DATABASE_USERNAME: apprunner.Secret.fromSecretsManager(
              databaseCredentials,
              "username"
            ),
            DATABASE_PASSWORD: apprunner.Secret.fromSecretsManager(
              databaseCredentials,
              "password"
            ),
            AWS_SECRET_ACCESS_KEY:
              apprunner.Secret.fromSecretsManager(accessKeySecretValue),
            JWT_SECRET: apprunner.Secret.fromSecretsManager(
              jwtSecret,
              "JWT_SECRET"
            ),
          },
          environmentVariables: {
            NODE_ENV: environmentName,
            AWS_ACCESS_KEY_ID: accessKeyId,
            DATABASE_HOST: databaseHost,
            DATABASE_PORT: "5432",
            DATABASE_NAME: "main",
          },
        },
        repository: ecr.Repository.fromRepositoryName(
          this,
          imageRepoName,
          imageRepoName
        ),
        tagOrDigest: "latest",
      }),
      // vpcConnector,
    });
    // add properties
    const cfnService = service.node.defaultChild as CfnService;
    cfnService.addPropertyOverride("HealthCheckConfiguration", {
      Protocol: "HTTP",
      Path: "/health",
    });
    cfnService.addPropertyOverride(
      "SourceConfiguration.AutoDeploymentsEnabled",
      true
    );
  }
}
