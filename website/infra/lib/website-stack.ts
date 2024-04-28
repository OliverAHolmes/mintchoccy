import * as cdk from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as customResources from 'aws-cdk-lib/custom-resources';
import { Stage } from 'aws-cdk-lib/core';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class MintWebsite extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const wwwSiteUrl = `www.mintchoccy.com`;
    const siteUrl = `mintchoccy.com`;

    const bucket = new s3.Bucket(this, `MintWebAppBucket`, {
      bucketName: `mint-website-cdk`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Deploy the React app to the S3 bucket
    new s3deploy.BucketDeployment(this, 'MintWebsiteDeployment', {
      sources: [s3deploy.Source.asset('../../website/dist')],
      destinationBucket: bucket,
    });

    // Get the certificate
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'MintCertificate',
      // found using aws acm list-certificates --region ap-southeast-2
      'arn:aws:acm:us-east-1:208792096778:certificate/6cf83d21-f290-42b0-b27c-0d0b6d8b9029',
    );

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      `OriginAccessIdentity`,
    );
    bucket.grantRead(originAccessIdentity);

    const cloudFrontDistribution = new cloudfront.Distribution(
      this,
      `MintDistribution`,
      {
        defaultRootObject: 'index.html',
        errorResponses: [
          {
            httpStatus: 404, // Not Found
            responsePagePath: '/index.html',
            responseHttpStatus: 200, // OK
          },
          {
            httpStatus: 403, // Forbidden (This often occurs due to missing objects in S3 when configured with CloudFront)
            responsePagePath: '/index.html',
            responseHttpStatus: 200, // OK
          },
        ],
        defaultBehavior: {
          origin: new origins.S3Origin(bucket, { originAccessIdentity }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: [wwwSiteUrl, siteUrl],
        certificate: certificate,
      },
    );

    const cloudFrontAwsResource = new customResources.AwsCustomResource(
      this,
      `CloudFrontInvalidation-${Date.now()}`,
      {
        onCreate: {
          physicalResourceId: customResources.PhysicalResourceId.of(
            `${cloudFrontDistribution.distributionId}-${Date.now()}`,
          ),
          service: 'CloudFront',
          action: 'createInvalidation',
          parameters: {
            DistributionId: cloudFrontDistribution.distributionId,
            InvalidationBatch: {
              CallerReference: Date.now().toString(),
              Paths: {
                Quantity: 1,
                Items: ['/*'],
              },
            },
          },
        },
        policy: customResources.AwsCustomResourcePolicy.fromSdkCalls({
          resources: customResources.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      },
    );

    cloudFrontAwsResource.node.addDependency(cloudFrontDistribution);

    // Create a HostedZone construct using the fromHostedZoneAttributes method
    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      `HostedZone`,
      {
        zoneName: siteUrl,
        hostedZoneId: 'Z01481177V8891T4YAVP',
      },
    );

    const wwwZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      `WwwHostedZone`,
      {
        zoneName: wwwSiteUrl,
        hostedZoneId: 'Z01481177V8891T4YAVP',
      },
    );

    // Adding out A Record code
    new route53.ARecord(this, `CDNARecord`, {
      zone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(cloudFrontDistribution),
      ),
    });

    new route53.AaaaRecord(this, `AliasRecord`, {
      zone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(cloudFrontDistribution),
      ),
    });

    new route53.ARecord(this, `WWWCDNARecord`, {
      zone: wwwZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(cloudFrontDistribution),
      ),
    });

    new route53.AaaaRecord(this, `WWWAliasRecord`, {
      zone: wwwZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(cloudFrontDistribution),
      ),
    });
  }
}
