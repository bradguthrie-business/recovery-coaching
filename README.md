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

4. **Update your `.env` file**
   
   After deployment, copy the API Gateway URL from the output and add it to your `.env`:
   ```env
   VITE_API_GATEWAY_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/Prod
   ```

### Lambda Functions

- **getJournalEntries**: Retrieves user's journal entries.
- **getRecoveryCounters**: Retrieves user's data for amount of time they are recovering from substances or vices.
- **getStepWork**: Retrieves the step work for the user.
- **getTodaysFocus**: Retrieves the focus of the day for the user, based off their recovery style and recent journals. This uses OpenAI.
- **getUserData**: Retrieves user's data, which includes recovery path, display name, email, and more.
- **getUserStats**: Retrieves user's stats for number of days sober, amount of journal entries, and number of community posts.
- **saveJournalEntry**: Saves user's journal entry.
- **saveRecoveryCounters**: Saves user's amount of time they are recovering from substances or vices.
- **saveStepWork**: Saves user's step work depending on their selected recovery path.
- **saveUserRecoveryPath**: Saves user's selected recovery path.

### DynamoDB Tables

- **RecoveryUsers**
   - Stores the information of the user.
- **RecoveryCounters**
   - Stores the days of sobriety/abstinence from specific substances of the user.
- **JournalEntries**
   - Stores the journal entries of the user.
- **StepWork**
   - Stores the step work of the user based on their recovery path.

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

