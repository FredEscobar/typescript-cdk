import * as cdk from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface NetworkingProps {
    maxAzs: number
}

export class Networking extends cdk.Construct {

    public readonly vpc:ec2.IVpc

    constructor(scope: cdk.Construct, id: string, props: NetworkingProps) {
        super(scope, id);

        this.vpc = new ec2.Vpc(this, 'AppVpc', {
            cidr : '10.0.0.0/16',
            maxAzs : props.maxAzs,
            subnetConfiguration : [
                {
                subnetType : ec2.SubnetType.PUBLIC,
                name : 'Public',
                cidrMask : 24
            },
            {
                subnetType : ec2.SubnetType.PRIVATE,
                cidrMask : 24,
                name : 'Private',
            }
        ]
        })


    }
}
