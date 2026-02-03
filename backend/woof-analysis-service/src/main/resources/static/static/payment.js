// Payment handling functions
export function handlePayment(amount) {
    // Validate amount
    if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
    }

    // Create payment object
    const payment = {
        amount,
        currency: 'INR',
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    // Simulate payment processing
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            payment.status = 'completed';
            payment.transactionId = `TXN${Date.now()}`;
            resolve(payment);
        }, 2000);
    });
}

// QR code generation
export function generateQRCode(amount) {
    const upiId = "animalrescue@axis";
    const recipientName = "Woof";
    const currency = "INR";

    // Construct the UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=${currency}`;

    // Generate QR code using QRServer API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
}

// Transaction history management
export function saveTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return transaction;
}

export function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
}

// Wallet management
export function connectWallet() {
    const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    localStorage.setItem('walletAddress', walletAddress);
    return walletAddress;
}

export function getWalletAddress() {
    return localStorage.getItem('walletAddress');
}

// Fraud prevention
export function checkTransactionRisk(amount) {
    const transactions = getTransactions();
    const recentTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.timestamp);
        const now = new Date();
        return (now - txDate) < 24 * 60 * 60 * 1000; // Last 24 hours
    });

    const totalRecentAmount = recentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    return {
        riskLevel: totalRecentAmount + amount > 10000 ? 'high' : 'low',
        recentTransactions: recentTransactions.length,
        totalRecentAmount
    };
} 