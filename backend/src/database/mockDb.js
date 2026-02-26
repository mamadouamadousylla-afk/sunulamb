// Mock database implementation for development without MongoDB

// In-memory storage
let users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@sunulamb.sn',
    password: '$2a$10$8K1p/a0d44LpOq8.YLQ8eezfOjO8C2YqsDsGnD4La3UPtkzqpZdqa', // 'password123' - hashed
    phone: '+22112345678',
    avatar: '',
    points: 0,
    level: 'Beginner',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@sunulamb.sn',
    password: '$2a$10$8K1p/a0d44LpOq8.YLQ8eezfOjO8C2YqsDsGnD4La3UPtkzqpZdqa', // 'password123' - hashed
    phone: '+22187654321',
    avatar: '',
    points: 150,
    level: 'Fan',
    role: 'USER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let events = [
  {
    id: '1',
    title: 'Modou Lô vs Sa Thiès',
    description: 'Grand Combat de Lutte Sénégalaise',
    date: new Date(Date.now() + 7*24*60*60*1000), // 7 days from now
    time: '20:00',
    location: 'Arène Nationale de Lutte',
    address: 'Pikine, Dakar',
    status: 'SCHEDULED',
    heroImage: '',
    totalTickets: 1000,
    availableTickets: 850,
    deadline: null,
    organizer: '1', // Admin user
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Balla Gaye 2 vs Yékini',
    description: 'Combat de prestige',
    date: new Date(Date.now() + 14*24*60*60*1000), // 14 days from now
    time: '19:30',
    location: 'Grand Arena',
    address: 'Dakar Plateau',
    status: 'SCHEDULED',
    heroImage: '',
    totalTickets: 1500,
    availableTickets: 1500,
    deadline: null,
    organizer: '1', // Admin user
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let tickets = [
  {
    id: '1',
    qrCode: 'QR-123456789',
    event: '1',
    user: '2',
    category: 'VIP',
    status: 'ACTIVE',
    purchaseDate: new Date(),
    validationDate: null,
    validationCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let transactions = [
  {
    id: '1',
    reference: 'TXN-12345',
    user: '2',
    event: '1',
    ticketIds: ['1'],
    amount: 15000,
    currency: 'XOF',
    paymentMethod: 'WAVE',
    providerRef: 'PROV-54321',
    status: 'COMPLETED',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper function to generate IDs
const generateId = () => {
  return (Math.floor(Math.random() * 1000000)).toString();
};

// User operations
const User = {
  findById: (id) => users.find(user => user.id === id),
  findByEmail: (email) => users.find(user => user.email.toLowerCase() === email.toLowerCase()),
  findAll: () => users,
  create: (userData) => {
    const newUser = {
      id: generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return newUser;
  },
  updateById: (id, updateData) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...updateData,
        updatedAt: new Date()
      };
      return users[index];
    }
    return null;
  },
  deleteById: (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deleted = users.splice(index, 1);
      return deleted[0];
    }
    return null;
  }
};

// Event operations
const Event = {
  findById: (id) => events.find(event => event.id === id),
  findAll: () => events,
  create: (eventData) => {
    const newEvent = {
      id: generateId(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    events.push(newEvent);
    return newEvent;
  },
  updateById: (id, updateData) => {
    const index = events.findIndex(event => event.id === id);
    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...updateData,
        updatedAt: new Date()
      };
      return events[index];
    }
    return null;
  },
  deleteById: (id) => {
    const index = events.findIndex(event => event.id === id);
    if (index !== -1) {
      const deleted = events.splice(index, 1);
      return deleted[0];
    }
    return null;
  }
};

// Ticket operations
const Ticket = {
  findById: (id) => tickets.find(ticket => ticket.id === id),
  findByUserId: (userId) => tickets.filter(ticket => ticket.user === userId),
  findByEventId: (eventId) => tickets.filter(ticket => ticket.event === eventId),
  findAll: () => tickets,
  create: (ticketData) => {
    const newTicket = {
      id: generateId(),
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tickets.push(newTicket);
    return newTicket;
  },
  updateById: (id, updateData) => {
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index !== -1) {
      tickets[index] = {
        ...tickets[index],
        ...updateData,
        updatedAt: new Date()
      };
      return tickets[index];
    }
    return null;
  },
  deleteById: (id) => {
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index !== -1) {
      const deleted = tickets.splice(index, 1);
      return deleted[0];
    }
    return null;
  }
};

// Transaction operations
const Transaction = {
  findById: (id) => transactions.find(transaction => transaction.id === id),
  findByUserId: (userId) => transactions.filter(transaction => transaction.user === userId),
  findByEventId: (eventId) => transactions.filter(transaction => transaction.event === eventId),
  findAll: () => transactions,
  create: (transactionData) => {
    const newTransaction = {
      id: generateId(),
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    transactions.push(newTransaction);
    return newTransaction;
  },
  updateById: (id, updateData) => {
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        ...updateData,
        updatedAt: new Date()
      };
      return transactions[index];
    }
    return null;
  },
  deleteById: (id) => {
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
      const deleted = transactions.splice(index, 1);
      return deleted[0];
    }
    return null;
  }
};

module.exports = {
  User,
  Event,
  Ticket,
  Transaction
};