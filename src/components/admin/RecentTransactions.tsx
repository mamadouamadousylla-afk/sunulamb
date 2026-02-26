import React from 'react';

interface Transaction {
  id: string;
  user: string;
  event: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const RecentTransactions = () => {
  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      user: 'Jean Diop',
      event: 'Modou Lô vs Sa Thiès',
      amount: '15,000 FCFA',
      date: '2024-02-25',
      status: 'completed'
    },
    {
      id: 'TXN-002',
      user: 'Awa Fall',
      event: 'Balla Gaye 2 vs Yékini',
      amount: '30,000 FCFA',
      date: '2024-02-24',
      status: 'completed'
    },
    {
      id: 'TXN-003',
      user: 'Mamadou Sow',
      event: 'Eumeu Sène vs Thiès',
      amount: '10,000 FCFA',
      date: '2024-02-24',
      status: 'pending'
    },
    {
      id: 'TXN-004',
      user: 'Fatou Kane',
      event: 'Modou Lô vs Sa Thiès',
      amount: '20,000 FCFA',
      date: '2024-02-23',
      status: 'completed'
    },
    {
      id: 'TXN-005',
      user: 'Ibra Diallo',
      event: 'Balla Gaye 2 vs Yékini',
      amount: '5,000 FCFA',
      date: '2024-02-23',
      status: 'failed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{transaction.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{transaction.user}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{transaction.event}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{transaction.amount}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{transaction.date}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;