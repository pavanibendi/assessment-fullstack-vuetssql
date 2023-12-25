import { Duration, RemovalPolicy } from "aws-cdk-lib";
import {
  InstanceType,
  IVpc,
  Vpc,
  SecurityGroup,
  SubnetType,
  Port,
  Peer,
} from "aws-cdk-lib/aws-ec2";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  DatabaseClusterEngine,
  SubnetGroup,
  DatabaseCluster,
  AuroraPostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

interface Props {
  databaseName: string;
  databaseSecretName: string;
  isProd: boolean;
}

export class AuroraPostgres extends Construct {
  databaseName: string;
  database: DatabaseCluster;

  constructor(
    scope: Construct,
    id: string,
    { databaseName, databaseSecretName }: Props
  ) {
    super(scope, id);

    this.databaseName = databaseName;
    const databaseUsername = `mainsuperuser`;
    const clusterName = `${this.databaseName}-cluster`;
    const subnetGroupName = `${this.databaseName}-subnet`;

    // 👇 create the VPC
    const vpcName = `${this.databaseName}-vpc`;
    const vpc = new Vpc(this, vpcName, {
      vpcName,
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: "public-subnet-1",
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "isolated-subnet-1",
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });
    const securityGroup = new SecurityGroup(this, `${this.databaseName}-sg`, {
      vpc,
      description: `${this.databaseName}-sg`,
      securityGroupName: `${this.databaseName}-sg`,
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432),
      "Allow all inbound traffic on port 5432"
    );

    // secret
    const databaseCredentialsSecret = new Secret(
      this,
      `${this.databaseName}-credentials`,
      {
        secretName: databaseSecretName,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: databaseUsername,
          }),
          generateStringKey: "password",
          excludePunctuation: true,
        },
      }
    );

    // define the database
    const dbEngine = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_14_6,
    });
    this.database = new DatabaseCluster(this, clusterName, {
      engine: dbEngine,
      defaultDatabaseName: "main",
      // parameterGroup,
      clusterIdentifier: clusterName,
      instances: 1,
      subnetGroup: this.createSubnetGroup(vpc, subnetGroupName),
      instanceProps: {
        instanceType: new InstanceType("t3.medium"),
        vpc,
        securityGroups: [securityGroup],
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
      },
      backup: {
        retention: Duration.days(RetentionDays.ONE_MONTH),
        preferredWindow: "03:00-06:00",
      },
      credentials: {
        username: databaseUsername,
        password: databaseCredentialsSecret.secretValueFromJson("password"),
      },
      cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
    });
  }
  // you need to create a subnet group for your database
  private createSubnetGroup(vpc: IVpc, subnetGroupName: string) {
    return new SubnetGroup(this, subnetGroupName, {
      description: `Aurora PG Subnet Group for database ${this.databaseName}`,
      subnetGroupName,
      vpc,
      removalPolicy: RemovalPolicy.DESTROY,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
    });
  }
}
