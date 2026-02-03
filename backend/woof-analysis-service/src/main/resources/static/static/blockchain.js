class MockBlockchain {
    constructor() {
        this.transactions = [];
        this.wallets = new Map();
        this.loadFromStorage();
    }

    loadFromStorage() {
        const savedData = localStorage.getItem('mockBlockchain');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.transactions = data.transactions || [];
            this.wallets = new Map(Object.entries(data.wallets || {}));
        }
    }

    saveToStorage() {
        const data = {
            transactions: this.transactions,
            wallets: Object.fromEntries(this.wallets)
        };
        localStorage.setItem('mockBlockchain', JSON.stringify(data));
    }

    connectWallet() {
        const walletAddress = `inr:0xIND${Math.random().toString(36).substr(2, 10)}`;
        this.wallets.set(walletAddress, {
            balance: Math.floor(Math.random() * 10000),
            currency: 'INR',
            lastUpdated: new Date().toISOString()
        });
        this.saveToStorage();
        return walletAddress;
    }

    makeTransaction(amount, purpose) {
        const tx = {
            id: `TXIN${Date.now()}`,
            amount: amount,
            currency: 'INR',
            purpose: purpose,
            timestamp: new Date().toISOString(),
            status: 'pending',
            block: Math.floor(Math.random() * 1000000),
            hash: `0x${Math.random().toString(16).substr(2, 10)}`,
            network: 'Mumbai Polygon Testnet'
        };
        
        // Simulate blockchain confirmation
        setTimeout(() => {
            tx.status = 'confirmed';
            this.transactions.push(tx);
            this.saveToStorage();
        }, 2000);
        
        return tx;
    }

    getTransactionHistory() {
        return this.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    getWalletBalance(address) {
        return this.wallets.get(address)?.balance || 0;
    }
}

class MockSmartContract {
    constructor() {
        this.donations = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        const savedData = localStorage.getItem('mockSmartContract');
        if (savedData) {
            this.donations = JSON.parse(savedData);
        }
    }

    saveToStorage() {
        localStorage.setItem('mockSmartContract', JSON.stringify(this.donations));
    }

    async donate(amount, purpose) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const donation = {
                    id: `DON${Date.now()}`,
                    amount,
                    purpose,
                    timestamp: new Date().toISOString(),
                    status: 'funds_held',
                    releaseDate: Date.now() + 259200000, // 3 days later
                    verification: {
                        vetApproval: false,
                        ngoConfirmation: false,
                        releaseStatus: 'pending'
                    }
                };
                this.donations.push(donation);
                this.saveToStorage();
                resolve(donation);
            }, 1500);
        });
    }

    getDonations() {
        return this.donations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
}

export const blockchain = new MockBlockchain();
export const contract = new MockSmartContract();