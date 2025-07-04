# Deployment Guide

This guide will help you deploy your Finance Visualizer app with a live database.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free)
- Vercel account (free)

## Step 1: Set up MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the "Free" plan (M0)

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

### 1.3 Set up Database Access
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 1.4 Set up Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Your Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `<dbname>` with `finance_tracker`

Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/finance_tracker?retryWrites=true&w=majority
```

## Step 2: Prepare Your Code

### 2.1 Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/mihir0336/finance-visualizer.git
git push -u origin main
```

### 2.2 Create Environment File (for local testing)
Create a `.env.local` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance_tracker?retryWrites=true&w=majority
```

## Step 3: Deploy to Vercel

### 3.1 Connect to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your GitHub repository

### 3.2 Configure Environment Variables
1. In the project settings, go to "Environment Variables"
2. Add a new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string
   - **Environment**: Production, Preview, Development
3. Click "Save"

### 3.3 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Step 4: Test Your Deployment

### 4.1 Verify Database Connection
1. Open your deployed app
2. Try adding a transaction
3. Check if it appears in your MongoDB Atlas database

### 4.2 Test All Features
- Add transactions (income and expenses)
- View dashboard
- Set budgets
- Check insights
- Test mobile responsiveness

## Alternative Deployment Options

### Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variable: `MONGODB_URI`
4. Deploy

### Netlify
1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Add environment variable: `MONGODB_URI`
4. Deploy

### Render
1. Go to [Render](https://render.com)
2. Connect your GitHub repository
3. Add environment variable: `MONGODB_URI`
4. Deploy

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
- Check your MongoDB Atlas connection string
- Verify network access is set to allow all IPs
- Ensure database user has correct permissions

#### 2. Build Errors
- Check that all dependencies are in `package.json`
- Verify TypeScript types are correct
- Check for any missing environment variables

#### 3. API Errors
- Ensure API routes are in the correct location (`app/api/`)
- Check that database operations are working
- Verify environment variables are set correctly

### Debugging Steps

1. **Check Vercel Logs**
   - Go to your project dashboard
   - Click on "Functions" tab
   - Check for any error logs

2. **Test Locally**
   - Run `pnpm dev` locally
   - Test with the same MongoDB connection string
   - Verify all features work

3. **Check Database**
   - Go to MongoDB Atlas
   - Check if collections are created
   - Verify data is being inserted

## Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to Git
- Use Vercel's environment variable system
- Rotate database passwords regularly

### 2. Database Security
- Use strong passwords for database users
- Consider IP whitelisting for production
- Enable MongoDB Atlas security features

### 3. API Security
- Consider adding authentication
- Implement rate limiting
- Validate all user inputs

## Performance Optimization

### 1. Database Indexing
Add indexes to your MongoDB collections:
```javascript
// In MongoDB Atlas console
db.transactions.createIndex({ "date": -1 })
db.transactions.createIndex({ "type": 1 })
db.budgets.createIndex({ "month": 1, "category": 1 })
```

### 2. Caching
- Consider implementing Redis for caching
- Cache frequently accessed data
- Use Next.js built-in caching

### 3. CDN
- Vercel automatically provides CDN
- Optimize images and static assets
- Use Next.js Image component

## Monitoring

### 1. Vercel Analytics
- Enable Vercel Analytics
- Monitor performance metrics
- Track user behavior

### 2. MongoDB Atlas Monitoring
- Monitor database performance
- Set up alerts for high usage
- Track query performance

### 3. Error Tracking
- Consider adding Sentry for error tracking
- Monitor API errors
- Track user-reported issues

## Cost Optimization

### 1. MongoDB Atlas
- Free tier includes 512MB storage
- Monitor usage to avoid overages
- Consider upgrading only when needed

### 2. Vercel
- Free tier includes 100GB bandwidth
- Monitor usage in dashboard
- Optimize bundle size

## Next Steps

1. **Add Authentication**
   - Implement user accounts
   - Add login/signup functionality
   - Secure user data

2. **Add More Features**
   - Export functionality
   - Advanced analytics
   - Multi-currency support

3. **Scale Up**
   - Monitor performance
   - Optimize database queries
   - Add caching layers

## Support

If you encounter issues:
1. Check the [Vercel documentation](https://vercel.com/docs)
2. Check the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com)
3. Create an issue in your GitHub repository
4. Ask for help in the [Vercel community](https://github.com/vercel/vercel/discussions) 