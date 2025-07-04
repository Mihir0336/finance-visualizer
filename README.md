# Personal Finance Visualizer

A comprehensive personal finance tracking application built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Features

###  Basic Transaction Tracking
- ✅ Add, edit, and delete transactions
- ✅ Display transactions in a responsive list
- ✅ Monthly expenses visualization with bar charts
- ✅ Form validation and error handling

### Categories & Dashboard
- ✅ Predefined expense categories
- ✅ Category-wise pie chart visualization
- ✅ Comprehensive dashboard with:
  - Total income/expenses summary
  - Category breakdown
  - Recent transactions
  - Monthly trends

### Budgeting & Insights
- ✅ Monthly budget setting per category
- ✅ Budget vs actual comparison
- ✅ Budget alerts and notifications
- ✅ AI-powered spending insights
- ✅ Personalized recommendations

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts with shadcn chart components
- **Database**: MongoDB
- **Styling**: Tailwind CSS with responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local` with your MongoDB connection string:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/finance_tracker
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/
│   ├── api/                 # API routes
│   │   ├── transactions/    # Transaction CRUD operations
│   │   ├── analytics/       # Analytics data
│   │   └── budgets/         # Budget management
│   └── page.tsx            # Main application page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── charts/             # Chart components
│   ├── dashboard.tsx       # Main dashboard
│   ├── transaction-form.tsx # Transaction form
│   ├── transaction-list.tsx # Transaction list
│   ├── budget-manager.tsx  # Budget management
│   └── insights.tsx        # Financial insights
├── lib/
│   ├── mongodb.ts          # Database connection
│   ├── db-operations.ts    # Database operations
│   └── types.ts            # TypeScript types
\`\`\`

## Features Overview

### Transaction Management
- Add income and expense transactions
- Edit existing transactions
- Delete transactions with confirmation
- Categorize transactions
- Date-based organization

### Visualizations
- Monthly income vs expenses bar chart
- Category-wise spending pie chart
- Budget progress indicators
- Trend analysis

### Budget Management
- Set monthly budgets per category
- Track budget vs actual spending
- Visual progress indicators
- Budget alerts and warnings

### Insights & Analytics
- Spending trend analysis
- Top spending categories
- Average transaction calculations
- Personalized recommendations
- Budget performance alerts

## Database Schema

### Transactions Collection
\`\`\`javascript
{
  _id: ObjectId,
  amount: Number,
  description: String,
  category: String,
  date: String,
  type: 'income' | 'expense',
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Budgets Collection
\`\`\`javascript
{
  _id: ObjectId,
  category: String,
  amount: Number,
  month: String, // YYYY-MM format
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## API Endpoints

- `GET /api/transactions` - Fetch transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/analytics` - Get analytics data
- `GET /api/budgets` - Fetch budgets
- `POST /api/budgets` - Set/update budget

## Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.


Built with ❤️ by Mihir Patel