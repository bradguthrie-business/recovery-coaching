# Deployment Guide

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - All `VITE_*` variables from your `.env` file

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. Add environment variables in Netlify dashboard

## AWS Backend Deployment

### Prerequisites

1. Install AWS SAM CLI:
   - Windows: Download from https://github.com/aws/aws-sam-cli/releases
   - Or use: `pip install aws-sam-cli`

2. Configure AWS credentials:
   ```bash
   aws configure
   ```

### Deploy Steps

1. **Build the application:**
   ```bash
   sam build
   ```

2. **Deploy (guided mode for first time):**
   ```bash
   sam deploy --guided
   ```
   
   This will prompt you for:
   - Stack name: `recovery-coaching-app`
   - AWS Region: `us-east-1`
   - Confirm changes: `Y`
   - Allow SAM CLI IAM role creation: `Y`
   - Disable rollback: `N`
   - Save arguments to configuration file: `Y`

3. **Note the API Gateway URL** from the output:
   ```
   Outputs:
   ApiGatewayApi = https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod/
   ```

4. **Update your frontend `.env` file:**
   ```env
   VITE_API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod
   ```

### Subsequent Deployments

After the first deployment, you can use:
```bash
sam build && sam deploy
```

## DynamoDB Setup

The DynamoDB table (`RecoveryUsers`) is automatically created during SAM deployment.

### Manual Table Creation (if needed)

If you need to create the table manually:

```bash
aws dynamodb create-table \
  --table-name RecoveryUsers \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Testing the Deployment

1. **Test Lambda functions locally:**
   ```bash
   sam local start-api
   ```

2. **Test with curl:**
   ```bash
   curl -X POST http://localhost:3000/saveUserRecoveryPath \
     -H "Content-Type: application/json" \
     -d '{"userId":"test123","email":"test@example.com","recoveryPath":"aa"}'
   ```

## Troubleshooting

### Lambda Function Errors

- Check CloudWatch Logs for each function
- Verify DynamoDB table exists and has correct permissions
- Ensure IAM roles have proper permissions

### CORS Issues

- Lambda functions include CORS headers
- If issues persist, check API Gateway CORS settings

### Environment Variables

- Frontend: Must be prefixed with `VITE_` for Vite to expose them
- Backend: Set in `template.yaml` under `Environment.Variables`

## Cost Estimation

- **DynamoDB**: Pay-per-request, very low cost for small scale
- **Lambda**: Free tier includes 1M requests/month
- **API Gateway**: Free tier includes 1M requests/month

For a small to medium app, costs should be minimal or free.

