import { StackProps, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
// import { IVpc, ISecurityGroup } from "aws-cdk-lib/aws-ec2";
import { s3Cloudfront } from "./constructs/s3-cloudfront";
import { AuroraPostgres } from "./constructs/aurora-postgres";
import { AppRunner } from "./constructs/apprunner";
import {
  EnvironmentName,
  UPLOAD_BUCKET_NAMES,
  CONTENT_BUCKET_NAMES,
  IMAGE_OPT_LAMBDA_NAMES,
  IMAGE_OPT_QUEUE_NAMES,
  DATABASE_NAMES,
  IMAGE_REPO_NAMES,
  API_SERVICE_NAMES,
} from "../aws-config";

export interface MainStackProps extends StackProps {
  tags: {
    environmentName: EnvironmentName;
  };
}

// todo: improve this stack according to the issue#20
export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props: MainStackProps) {
    super(scope, id, props);
    const environmentName = props.tags.environmentName;
    const isProd = environmentName === "production";
    const isDev = environmentName === "development";
    // image hosting
    const contentBucketName = CONTENT_BUCKET_NAMES[environmentName];
    const uploadBucketName = UPLOAD_BUCKET_NAMES[environmentName];
    const imageOptLambdaName = IMAGE_OPT_LAMBDA_NAMES[environmentName];
    const imageOptQueueName = IMAGE_OPT_QUEUE_NAMES[environmentName];
    new s3Cloudfront(this, contentBucketName, {
      isProd,
      contentBucketName,
      uploadBucketName,
      imageOptLambdaName,
      imageOptQueueName,
    });
    // create user with s3 and ses access for api
    const apiServiceName = API_SERVICE_NAMES[environmentName];
    const user = new iam.User(this, `${apiServiceName}-user`, {
      userName: `${apiServiceName}-user`,
    });
    user.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    user.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSESFullAccess")
    );
    user.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSQSFullAccess")
    );
    // create access keys
    const accessKey = new iam.AccessKey(this, `${apiServiceName}-access-key`, {
      user,
    });
    const accessKeySecretValue = new secretsmanager.Secret(
      this,
      `${apiServiceName}-secret`,
      {
        secretName: `${apiServiceName}-secret-access-key`,
        secretStringValue: accessKey.secretAccessKey,
      }
    );
    // database & apprunner
    if (!isDev) {
      const databaseName = DATABASE_NAMES[environmentName];
      const databaseSecretName = `${databaseName}-credentials`;
      const database = new AuroraPostgres(this, databaseName, {
        databaseName,
        databaseSecretName,
        isProd,
      });
      // get vpc by lookup
      // const vpc = database.node.findChild(`${databaseName}-vpc`) as IVpc;
      // const securityGroup = database.node.findChild(
      //   `${databaseName}-sg`
      // ) as ISecurityGroup;
      // create apprunner
      const imageRepoName = IMAGE_REPO_NAMES[environmentName];
      new AppRunner(this, apiServiceName, {
        serviceName: apiServiceName,
        imageRepoName,
        // vpc,
        // securityGroup,
        databaseSecretName,
        databaseHost: database.database.clusterEndpoint.hostname,
        accessKeyId: accessKey.accessKeyId,
        accessKeySecretValue,
        environmentName,
      });
    }
  }
}
