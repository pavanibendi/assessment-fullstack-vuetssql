import { RemovalPolicy, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket, HttpMethods, EventType } from "aws-cdk-lib/aws-s3";
import { Distribution, PriceClass } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import type { ImageOptimizationEnv } from "../lambda/image-optimization";
import { Runtime, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { Queue } from "aws-cdk-lib/aws-sqs";
interface Props {
  isProd: boolean;
  contentBucketName: string;
  uploadBucketName: string;
  imageOptLambdaName: string;
  imageOptQueueName: string;
}

const bucketBaseConfig = (isProd: boolean) => {
  return {
    removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    autoDeleteObjects: !isProd,
    cors: [
      {
        allowedHeaders: ["*"],
        allowedMethods: [
          HttpMethods.GET,
          HttpMethods.PUT,
          HttpMethods.POST,
          HttpMethods.DELETE,
          HttpMethods.HEAD,
        ],
        allowedOrigins: ["*"],
        maxAge: 3600,
      },
    ],
    blockPublicAccess: {
      blockPublicAcls: true,
      blockPublicPolicy: true,
      ignorePublicAcls: true,
      restrictPublicBuckets: true,
    },
  };
};

export class s3Cloudfront extends Construct {
  constructor(
    scope: Construct,
    id: string,
    {
      isProd,
      contentBucketName,
      uploadBucketName,
      imageOptLambdaName,
      imageOptQueueName,
    }: Props
  ) {
    super(scope, id);

    const uploadBucket = new Bucket(this, uploadBucketName, {
      ...bucketBaseConfig(isProd),
      bucketName: uploadBucketName,
    });

    const mainBucket = new Bucket(this, contentBucketName, {
      ...bucketBaseConfig(isProd),
      bucketName: contentBucketName,
    });

    // const distributionDomain = IMAGES_DOMAIN_NAMES[environmentName];
    // const domainCertificate = new acm.Certificate(this, 'Certificate', {
    //     domainName: distributionDomain,
    // });
    // cloudfront
    const priceClass = isProd
      ? PriceClass.PRICE_CLASS_ALL
      : PriceClass.PRICE_CLASS_100;
    new Distribution(this, `${contentBucketName}-distribution`, {
      defaultBehavior: {
        origin: new S3Origin(mainBucket),
      },
      priceClass,
      // domainNames: [distributionDomain],
    });

    // create a queue for the lambda to publish to
    const deadLetterQueue = new Queue(this, `${imageOptQueueName}-dlq`, {
      queueName: `${imageOptQueueName}-dlq`,
    });
    const imageOptQueue = new Queue(this, imageOptQueueName, {
      queueName: imageOptQueueName,
      visibilityTimeout: Duration.minutes(5),
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 3,
      },
    });
    // !important
    // todo: generate the layer from serverlessrepo using cdk
    // the sharp layer is manually created in the AWS console for now
    const imageOptLambda = new NodejsFunction(this, imageOptLambdaName, {
      functionName: imageOptLambdaName,
      entry: "./lib/lambda/image-optimization.ts",
      timeout: Duration.minutes(5),
      memorySize: 1024,
      runtime: Runtime.NODEJS_18_X,
      layers: [
        LayerVersion.fromLayerVersionArn(
          this,
          "sharp-layer",
          "arn:aws:lambda:eu-west-1:242219432226:layer:sharp:2"
        ),
      ],
      bundling: {
        externalModules: ["@aws-sdk/client-s3", "@aws-sdk/client-sqs", "sharp"],
      },
      environment: {
        CONTENT_BUCKET: contentBucketName,
        AWS_STACK_REGION: "eu-west-1",
        IMAGE_OPT_QUEUE_URL: imageOptQueue.queueUrl,
      } satisfies ImageOptimizationEnv,
    });
    // grant the lambda the necessary permissions
    uploadBucket.grantRead(imageOptLambda);
    uploadBucket.grantDelete(imageOptLambda);
    mainBucket.grantWrite(imageOptLambda);
    uploadBucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new LambdaDestination(imageOptLambda)
    );
    // allow the lambda to publish to the queue
    imageOptQueue.grantSendMessages(imageOptLambda);
  }
}
