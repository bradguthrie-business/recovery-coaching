# Sobriety At Ease - Recovery Coaching App

A modern, full-stack web application designed to support individuals on their recovery journey. Built with React, Firebase, AWS Lambda, and DynamoDB.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 🎯 Personalized Recovery Path Selection (AA, NA, SMART Recovery, Harm Reduction, etc.)
- 📊 Dashboard with sobriety tracking
- ☁️ Serverless Backend (AWS Lambda + DynamoDB)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Authentication**: Firebase Auth
- **Backend**: AWS Lambda (Serverless)
- **Database**: AWS DynamoDB
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with credentials
- AWS SAM CLI (for deploying Lambda functions)
- Firebase project (already configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd recovery-coaching
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (or use the provided one):
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
   VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   VITE_AWS_REGION=us-east-1
   VITE_API_GATEWAY_URL=your_api_gateway_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

## AWS Backend Setup

### Deploy Lambda Functions

1. **Install AWS SAM CLI**
   - Follow instructions at: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

2. **Build the SAM application**
   ```bash
   sam build
   ```

3. **Deploy to AWS**
   ```bash
   sam deploy --guided
   ```
   
   This will:
   - Create a DynamoDB table (`RecoveryUsers`)
   - Deploy Lambda functions
   - Create API Gateway endpoints
   - Output the API Gateway URL

4. **Update your `.env` file**
   
   After deployment, copy the API Gateway URL from the output and add it to your `.env`:
   ```env
   VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/Prod
   ```

### Lambda Functions

- **saveUserRecoveryPath**: Saves user's selected recovery path to DynamoDB
- **getUserData**: Retrieves user data from DynamoDB

### DynamoDB Schema

**Table: RecoveryUsers**

- `userId` (String, Partition Key) - Firebase User ID
- `email` (String) - User email
- `recoveryPath` (String) - Selected recovery path
- `createdAt` (String) - ISO timestamp
- `updatedAt` (String) - ISO timestamp

## Project Structure

```
recovery-coaching/
├── src/
│   ├── components/          # React components
│   │   ├── Onboarding.jsx   # Recovery path selection
│   │   └── ProtectedRoute.jsx
│   ├── context/             # React context
│   │   └── AuthContext.jsx  # Authentication context
│   ├── firebase/            # Firebase configuration
│   │   ├── config.js
│   │   └── auth.js
│   ├── aws/                 # AWS configuration
│   │   └── config.js
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── aws/
│   └── lambda/              # Lambda functions
│       ├── saveUserRecoveryPath/
│       └── getUserData/
├── template.yaml            # SAM template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Recovery Paths

Users can select from the following recovery approaches:

- AA (Alcoholics Anonymous)
- NA (Narcotics Anonymous)
- Celebrate Recovery
- SMART Recovery
- Cali Sober
- Psychedelic-Assisted
- Harm Reduction
- MAT (Suboxone/Methadone/Naltrexone)
- Abstinence-only
- Not sure yet

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Future Features

- Sobriety counter (multi-substance)
- Daily journaling
- Step work system
- Community feed
- Harm reduction resources
- Coaching marketplace
- Analytics and insights

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

