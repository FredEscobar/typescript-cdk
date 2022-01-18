import * as cdk from "constructs";
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as apig from 'aws-cdk-lib/aws-apigateway'
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { CfnOutput } from 'aws-cdk-lib'

interface DocumentMangementWebserverProps {
    vpc :  ec2.IVpc
    api : apig.LambdaRestApi
}

export class DocumentManagementWebServer extends cdk.Construct {
    constructor( scope: cdk.Construct, id: string, props? :DocumentMangementWebserverProps){
        super(scope, id);

        const webserverDocker = new DockerImageAsset(this, 'WebserverDockerAsset', {
            directory : path.join(__dirname, '..', 'containers', 'webserver')
        })

        const fargateService = new ecsp.ApplicationLoadBalancedFargateService(this, 'WebserverService', {
            vpc: props?.vpc,
            taskImageOptions : {
                image: ecs.ContainerImage.fromDockerImageAsset(webserverDocker),
                environment : {
                    SERVER_PORT : "8080",
                    API_BASE : props?.api.url!
                },
                containerPort: 8080
            }
        })

        new CfnOutput(this, 'WebserverHost', {
            exportName : 'WebserverHost',
            value: fargateService.loadBalancer.loadBalancerDnsName
        })
    }
}