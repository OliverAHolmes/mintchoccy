#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MintFrontend } from '../lib/frontend-stack';

const app = new cdk.App();

new MintFrontend(app, 'MintFrontend');
