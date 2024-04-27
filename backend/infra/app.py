#!/usr/bin/env python3

import aws_cdk as cdk

from infra.api_stack import MintApiStack


app = cdk.App()
MintApiStack(app, "MintApiStack")

app.synth()
