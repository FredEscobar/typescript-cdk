import { Sources } from './../api/getDocuments/node_modules/aws-sdk/clients/robomaker.d';
import { CfnOutput, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Networking } from './networking';
import { DocumentManagementAPI } from './api';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as path from 'path'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TypescriptCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'DocumentsBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    new s3Deploy.BucketDeployment(this, 'DocumentsDeployment', {
      sources : [
        s3Deploy.Source.asset(path.join(__dirname, '..', 'documents'))
      ],
      destinationBucket : bucket,
      memoryLimit : 512
    });

    new CfnOutput(this, 'DocumentsBucketNameExport', {
      value : bucket.bucketName,
      exportName : 'DocumentsBucketName'
    });

    const networkingStack = new Networking(this, 'Networkingconstruct', {
      maxAzs : 2
    });

    Tags.of(networkingStack).add('Module', 'Networking');

    const api = new DocumentManagementAPI(this, 'DocumentManagementAPI', {
      documentBucket : bucket
    });

    Tags.of(api).add('Module', 'API');

  }
}
