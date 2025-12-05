# Quick Start Guide

Get your Recovery Coaching app up and running in minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

The `.env` file is already created with your Firebase credentials. You'll need to add your API Gateway URL after deploying the backend.

## Step 3: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Step 4: Deploy AWS Backend (Optional for Development)

For full functionality, deploy the Lambda functions:

```bash
# Install AWS SAM CLI first (see DEPLOYMENT.md)

# Build and deploy
sam build
sam deploy --guided

# Copy the API Gateway URL from output and add to .env:
# VITE_API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod
```

**Note**: The app will work without the backend for basic authentication and UI testing. The backend is needed for saving/retrieving user recovery paths.

## Step 5: Test the App

1. **Sign Up**: Create a new account
2. **Onboarding**: Select your recovery path
3. **Dashboard**: View your personalized dashboard

## Development Tips

- The app uses Firebase for authentication (works immediately)
- Lambda functions return mock data when API Gateway is not configured
- Check browser console for any errors
- Use React DevTools for debugging

## Troubleshooting

### Firebase Auth Not Working
- Check that Firebase credentials in `.env` are correct
- Verify Firebase project is active in Firebase Console

### Lambda Calls Failing
- Ensure API Gateway URL is set in `.env`
- Check that Lambda functions are deployed
- Verify CORS is enabled (already configured in Lambda functions)

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

## Next Steps

- Add more features from the feature map
- Customize the UI/UX
- Add more recovery path content
- Implement sobriety counter
- Add journaling functionality

