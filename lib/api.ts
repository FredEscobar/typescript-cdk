import * as cdk from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from 'path'

interface DocumentManagementAPIProps {
    documentBucket:s3.IBucket
}


export class DocumentManagementAPI extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: DocumentManagementAPIProps){
        super(scope, id)

        const getDocumentsFunction = new lambda.NodejsFunction(this, 'GetDocumentsFunction', {
            runtime : Runtime.NODEJS_12_X,
            entry : path.join(__dirname, '..', 'api', 'getDocuments', 'index.ts'),
            handler : 'getDocuments',
            bundling: {
                externalModules : [
                    'aws-sdk'
                ]
            },
            environment : {
                DOCUMENTS_BUCKET_NAME :  props.documentBucket.bucketName
            }
        })

    }
}