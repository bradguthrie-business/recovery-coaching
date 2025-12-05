# AWS Setup Guide for Recovery At Ease

This guide will walk you through setting up your AWS account for the Recovery At Ease application.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install and configure AWS CLI
3. **AWS SAM CLI**: Install AWS SAM CLI for deploying serverless applications
4. **IAM Permissions**: Your AWS user needs permissions to create Lambda functions, API Gateway, DynamoDB tables, and IAM roles

## Step 1: Install AWS CLI

### Windows
```bash
# Download and install from:
# https://awscli.amazonaws.com/AWSCLIV2.msi
```

### macOS
```bash
brew install awscli
```

### Linux
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

## Step 2: Configure AWS Credentials

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: `{omitted}` (from your credentials)
- **AWS Secret Access Key**: `{omitted}` (from your credentials)
- **Default region**: `us-east-1` (recommended)
- **Default output format**: `json`

## Step 3: Install AWS SAM CLI

### Windows
```bash
# Download from:
# https://github.com/aws/aws-sam-cli/releases/latest
# Or use Chocolatey:
choco install aws-sam-cli
```

### macOS
```bash
brew install aws-sam-cli
```

### Linux
```bash
pip install aws-sam-cli
```

Verify installation:
```bash
sam --version
```

## Step 4: Required IAM Permissions

Your AWS user/role needs the following permissions:

### Minimum Required Permissions:

1. **Lambda**: 
   - `lambda:CreateFunction`
   - `lambda:UpdateFunctionCode`
   - `lambda:UpdateFunctionConfiguration`
   - `lambda:GetFunction`
   - `lambda:DeleteFunction`
   - `lambda:InvokeFunction`
   - `lambda:AddPermission`
   - `lambda:CreateAlias`
   - `lambda:UpdateAlias`
   - `lambda:ListAliases`

2. **API Gateway**:
   - `apigateway:*`

3. **DynamoDB**:
   - `dynamodb:CreateTable`
   - `dynamodb:DescribeTable`
   - `dynamodb:PutItem`
   - `dynamodb:GetItem`
   - `dynamodb:Query`
   - `dynamodb:UpdateItem`
   - `dynamodb:DeleteItem`
   - `dynamodb:Scan`

4. **IAM**:
   - `iam:CreateRole`
   - `iam:GetRole`
   - `iam:PassRole`
   - `iam:AttachRolePolicy`
   - `iam:PutRolePolicy`

5. **CloudFormation**:
   - `cloudformation:*`

6. **S3** (for SAM deployment):
   - `s3:CreateBucket`
   - `s3:GetObject`
   - `s3:PutObject`
   - `s3:ListBucket`

### Quick Setup: Use AdministratorAccess (for development only)

For development/testing, you can attach the `AdministratorAccess` policy to your IAM user. **Warning**: This gives full access. For production, use least-privilege policies.

## Step 5: Create S3 Bucket for SAM Deployments

SAM needs an S3 bucket to store deployment artifacts:

```bash
aws s3 mb s3://recovery-at-ease-sam-deployments --region us-east-1
```

Or use the AWS Console:
1. Go to S3
2. Click "Create bucket"
3. Name: `recovery-at-ease-sam-deployments`
4. Region: `us-east-1`
5. Click "Create bucket"

## Step 6: Deploy the Application

From the project root directory:

```bash
# Build the application
sam build

# Deploy (first time - guided mode)
sam deploy --guided
```

During guided deployment, you'll be asked:
- **Stack Name**: `recovery-at-ease-app`
- **AWS Region**: `us-east-1`
- **Parameter UsersTableName**: `RecoveryUsers` (default)
- **Parameter CountersTableName**: `RecoveryCounters` (default)
- **Parameter JournalTableName**: `JournalEntries` (default)
- **Parameter StepWorkTableName**: `StepWork` (default)
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y`
- **Disable rollback**: `N`
- **Save arguments to configuration file**: `Y`

### Subsequent Deployments

After the first deployment, you can use:
```bash
sam build && sam deploy
```

## Step 7: Get API Gateway URL

After deployment, SAM will output the API Gateway URL. Look for:

```
Outputs:
ApiGatewayApi = https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod/
```

Copy this URL and add it to your `.env` file:

```env
VITE_API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod
```

## Step 8: Verify Deployment

### Check DynamoDB Tables

```bash
aws dynamodb list-tables
```

You should see:
- `RecoveryUsers`
- `RecoveryCounters`
- `JournalEntries`
- `StepWork`

### Check Lambda Functions

```bash
aws lambda list-functions --query 'Functions[?contains(FunctionName, `Recovery`) || contains(FunctionName, `recovery`)].FunctionName'
```

### Test a Lambda Function

```bash
aws lambda invoke \
  --function-name recovery-at-ease-app-GetUserDataFunction-xxxxx \
  --payload '{"body":"{\"userId\":\"test123\"}"}' \
  response.json
```

## Step 9: (Optional) Set Up AI for Today's Focus

The `getTodaysFocus` Lambda function currently uses placeholder logic. To add real AI:

1. **Option A: OpenAI API**
   - Get an OpenAI API key
   - Add it as an environment variable in the Lambda function
   - Update `aws/lambda/getTodaysFocus/index.js` to call OpenAI API

2. **Option B: AWS Bedrock**
   - Enable AWS Bedrock in your account
   - Update the Lambda to use Bedrock SDK
   - Add appropriate IAM permissions

3. **Option C: AWS Comprehend**
   - Use AWS Comprehend for sentiment analysis
   - Combine with rule-based recommendations

## Troubleshooting

### Error: "User is not authorized to perform: lambda:CreateFunction"

**Solution**: Your IAM user needs Lambda permissions. See Step 4.

### Error: "Bucket does not exist"

**Solution**: Create the S3 bucket for SAM deployments (Step 5).

### Error: "API Gateway CORS errors"

**Solution**: CORS is already configured in Lambda functions. If issues persist, check API Gateway CORS settings in the AWS Console.

### Error: "DynamoDB table already exists"

**Solution**: Either delete the existing table or change the table name in `template.yaml`.

### Error: "Region not available"

**Solution**: Some AWS services may not be available in all regions. Use `us-east-1` (N. Virginia) for best compatibility.

## Cost Estimation

### Free Tier (First 12 Months)
- **Lambda**: 1M requests/month free
- **API Gateway**: 1M requests/month free
- **DynamoDB**: 25 GB storage, 25 read/write units free

### Estimated Monthly Cost (After Free Tier)
For a small to medium app (1000 users, 10K requests/day):
- **Lambda**: ~$0.20/month
- **API Gateway**: ~$3.50/month
- **DynamoDB**: ~$1-5/month (pay-per-request)

**Total**: ~$5-10/month for small scale

## Security Best Practices

1. **Never commit AWS credentials to Git**
   - Use environment variables
   - Use AWS Secrets Manager for production

2. **Use IAM roles with least privilege**
   - Don't use AdministratorAccess in production

3. **Enable CloudWatch Logs**
   - Monitor Lambda function logs
   - Set up alarms for errors

4. **Enable API Gateway throttling**
   - Prevent abuse
   - Set rate limits

5. **Use VPC for Lambda (if needed)**
   - For accessing private resources
   - Not needed for basic DynamoDB access

## Next Steps

1. Set up CloudWatch alarms for monitoring
2. Configure API Gateway custom domain (optional)
3. Set up CI/CD pipeline (GitHub Actions, etc.)
4. Add authentication/authorization at API Gateway level
5. Enable AWS X-Ray for tracing

## Support

If you encounter issues:
1. Check CloudWatch Logs for Lambda functions
2. Verify IAM permissions
3. Check API Gateway logs
4. Review SAM deployment logs

For more help, refer to:
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)

