# Permanent PATH Setup for AWS CLI and SAM CLI

## Quick Fix (Current Session Only)

Run this in your Git Bash terminal:

```bash
export PATH="/c/Program Files/Amazon/AWSCLIV2:/c/Users/bradl/AppData/Local/Programs/Python/Python313/Scripts:$PATH"
```

## Permanent Fix (Recommended)

Add these lines to your `~/.bashrc` file to make the PATH changes permanent:

### Step 1: Open or create ~/.bashrc

```bash
nano ~/.bashrc
```

Or if it doesn't exist:
```bash
touch ~/.bashrc
nano ~/.bashrc
```

### Step 2: Add these lines at the end of the file

```bash
# AWS CLI
export PATH="/c/Program Files/Amazon/AWSCLIV2:$PATH"

# AWS SAM CLI (via Python)
export PATH="/c/Users/bradl/AppData/Local/Programs/Python/Python313/Scripts:$PATH"
```

### Step 3: Save and reload

1. Press `Ctrl+X` to exit
2. Press `Y` to confirm
3. Press `Enter` to save
4. Reload your shell:
   ```bash
   source ~/.bashrc
   ```

## Alternative: Windows System PATH

You can also add these paths to Windows System PATH (affects all terminals):

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" tab
3. Click "Environment Variables"
4. Under "User variables" or "System variables", find "Path" and click "Edit"
5. Click "New" and add:
   - `C:\Program Files\Amazon\AWSCLIV2`
   - `C:\Users\bradl\AppData\Local\Programs\Python\Python313\Scripts`
6. Click OK on all dialogs
7. Restart your terminal

## Verify Installation

After setting up PATH, verify both tools work:

```bash
aws --version
sam --version
```

You should see:
- `aws-cli/2.32.10 Python/3.13.9 Windows/10 exe/AMD64`
- `SAM CLI, version 1.150.1`

## Next Steps

Once both tools are working, you can:

1. Configure AWS credentials:
   ```bash
   aws configure
   ```

2. Start deploying your Lambda functions:
   ```bash
   sam build
   sam deploy --guided
   ```

