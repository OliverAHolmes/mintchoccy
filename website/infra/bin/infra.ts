#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MintWebsite } from '../lib/website-stack';

const app = new cdk.App();

new MintWebsite(app, 'MintWebsite', {});
