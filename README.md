# Finance Visualizer

A modern, responsive finance tracking application built with Next.js, TypeScript, and MongoDB.

## Features

- 📊 **Real-time Dashboard** - Live financial overview with charts and insights
- 💰 **Transaction Management** - Add, edit, and delete income/expense transactions
- 📈 **Budget Tracking** - Set and monitor category-based budgets
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌙 **Dark Theme** - Beautiful dark mode with theme toggle
- ⚡ **Live Updates** - Real-time data synchronization across tabs
- 🔄 **Lazy Loading** - Efficient transaction loading with pagination
- 💾 **Tab Persistence** - Remembers your last viewed tab

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB database

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment Options

### Option 1: Vercel + MongoDB Atlas (Recommended)

#### Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Set up database access (create a user)
5. Set up network access (allow all IPs: 0.0.0.0/0)
6. Get your connection string

#### Step 2: Deploy to Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
5. Deploy!

### Option 2: Railway + MongoDB Atlas

#### Step 1: Set up Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variable: `MONGODB_URI`
4. Deploy!

### Option 3: Netlify + MongoDB Atlas

#### Step 1: Set up Netlify
1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Add environment variable: `MONGODB_URI`
4. Deploy!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |

## Database Schema

### Transactions Collection
```typescript
{
  _id: ObjectId,
  amount: number,
  description: string,
  category: string,
  date: string,
  type: "income" | "expense",
  createdAt: Date,
  updatedAt: Date
}
```

### Budgets Collection
```typescript
{
  _id: ObjectId,
  category: string,
  amount: number,
  month: string, // YYYY-MM format
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

- `GET /api/transactions` - Get transactions with pagination
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/analytics` - Get dashboard analytics
- `GET /api/budgets` - Get budgets for a month
- `POST /api/budgets` - Create/update budget

## Features in Detail

### Real-time Updates
- Automatic data refresh every 5 seconds
- Cross-tab synchronization
- Live updates when data changes

### Mobile Responsive
- Optimized for all screen sizes
- Touch-friendly interface
- Responsive charts and layouts

### Dark Theme
- System theme detection
- Manual theme toggle
- Persistent theme preference

### Lazy Loading
- 10 transactions per page
- Load more functionality
- Efficient data loading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your environment and steps to reproduce

## Roadmap

- [ ] Export data to CSV/PDF
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Financial goals tracking
- [ ] Advanced analytics
- [ ] Mobile app