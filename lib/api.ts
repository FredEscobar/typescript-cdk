import { BucketPermissionConfiguration } from './../api/getDocuments/node_modules/aws-sdk/clients/macie2.d';
import * as cdk from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as iam from 'aws-cdk-lib/aws-iam'
import * as path from 'path'

interface DocumentManagementAPIProps {
    documentBucket: s3.IBucket
}


export class DocumentManagementAPI extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: DocumentManagementAPIProps) {
        super(scope, id)

        const getDocumentsFunction = new lambda.NodejsFunction(this, 'GetDocumentsFunction', {
            runtime: Runtime.NODEJS_12_X,
            entry: path.join(__dirname, '..', 'api', 'getDocuments', 'index.ts'),
            handler: 'getDocuments',
            bundling: {
                externalModules: [
                    'aws-sdk'
                ]
            },
            environment: {
                DOCUMENTS_BUCKET_NAME: props.documentBucket.bucketName
            }
        })

        const bucketPermissions = new iam.PolicyStatement();
        bucketPermissions.addResources(`${props.documentBucket.bucketArn}/*`);
        bucketPermissions.addActions('s3:GetObject', 's3:PutObject');
        getDocumentsFunction.addToRolePolicy(bucketPermissions);

        const bucketContainerPermissions = new iam.PolicyStatement();
        bucketContainerPermissions.addResources(props.documentBucket.bucketArn);
        bucketContainerPermissions.addActions('s3:ListBucket');
        getDocumentsFunction.addToRolePolicy(bucketContainerPermissions);

    }
}