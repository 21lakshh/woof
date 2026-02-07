const PAYMENT_SERVICE_URL = 'http://localhost:8081/payment';

// Payment handling functions
export async function handlePayment(amount, upiId) {
    // Validate amount
    if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
    }

    try {
        const response = await fetch(`${PAYMENT_SERVICE_URL}/donate-money`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount.toString(),
                currency: 'INR',
                upiId: upiId || 'anonymous',
                status: 'COMPLETED',
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Payment failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
}

// QR code generation
export function generateQRCode(amount) {
    const upiId = "parthbatrab@okicici";
    const recipientName = "Woof";
    const currency = "INR";

    // Construct the UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=${currency}`;

    // Generate QR code using QRServer API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
}

// Transaction history management
export async function getTransactions(upiId) {
    try {
        const response = await fetch(`${PAYMENT_SERVICE_URL}/history?UPIid=${upiId || 'anonymous'}`);
        if (!response.ok) {
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

// Wallet management
export async function connectWallet(upiId) {
    try {
        const response = await fetch(`${PAYMENT_SERVICE_URL}/wallet/connect?UPIid=${upiId || 'user_' + Date.now()}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Wallet connection failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Wallet error:', error);
        // Fallback for demo if backend is offline
        console.warn('Backend unavailable, using fallback wallet address');
        return {
            transactionId: `fallback_${Date.now()}`,
            amount: "0",
            status: "CONNECTED"
        };
    }
}

// Fraud prevention (Simplified for backend)
export function checkTransactionRisk(amount) {
    return {
        riskLevel: amount > 10000 ? 'high' : 'low',
        recentTransactions: 0,
        totalRecentAmount: 0
    };
} 