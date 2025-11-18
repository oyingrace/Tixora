# Tixora dApp - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [User Guide](#user-guide)
4. [Event Organizer Guide](#event-organizer-guide)
5. [Technical Architecture](#technical-architecture)
6. [Smart Contract Integration](#smart-contract-integration)
7. [Developer Guide](#developer-guide)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)
10. [Security & Best Practices](#security--best-practices)

---

## Overview

**Tixora** is a decentralized ticketing platform built on blockchain technology that revolutionizes event ticketing through NFT-based tickets. The platform eliminates common issues in traditional ticketing such as fraud, scalping, and lack of ownership verification while providing enhanced utility and experiences for ticket holders.

### Tickets API

#### Get Ticket Details
```http
GET /api/tickets/{tokenId}
```

Response:
```json
{
  "tokenId": 12345,
  "eventId": 1,
  "owner": "0xabcd...efgh",
  "eventDetails": {
    "name": "Summer Music Festival",
    "venue": "Central Park Amphitheater",
    "startDate": "2025-07-15T18:00:00Z",
    "endDate": "2025-07-17T23:00:00Z"
  },
  "purchaseDate": "2025-06-15T10:30:00Z",
  "purchasePrice": 0.5,
  "isUsed": false,
  "usedDate": null,
  "metadataUri": "ipfs://QmABC...",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "transferHistory": [
    {
      "from": "0x0000...0000",
      "to": "0xabcd...efgh",
      "date": "2025-06-15T10:30:00Z",
      "transactionHash": "0x123...456"
    }
  ]
}
```

#### Transfer Ticket
```http
POST /api/tickets/{tokenId}/transfer
```

Request Body:
```json
{
  "toAddress": "0x9876...5432",
  "message": "Happy birthday gift!"
}
```

### Marketplace API

#### Get Market Listings
```http
GET /api/marketplace/listings
```

Query Parameters:
- `page` (int): Page number
- `limit` (int): Items per page
- `event_id` (int): Filter by event
- `price_min` (number): Minimum price
- `price_max` (number): Maximum price
- `sort` (string): Sort by (price_asc, price_desc, date_asc, date_desc)

Response:
```json
{
  "listings": [
    {
      "listingId": 789,
      "tokenId": 12345,
      "seller": "0xabcd...efgh",
      "price": 0.7,
      "listingDate": "2025-06-20T14:00:00Z",
      "eventId": 1,
      "eventName": "Summer Music Festival",
      "originalPrice": 0.5,
      "priceChange": 40,
      "sellerRating": 4.8,
      "sellerSales": 23,
      "isVerified": true
    }
  ]
}
```

#### Create Listing
```http
POST /api/marketplace/listings
```

Request Body:
```json
{
  "tokenId": 12345,
  "price": 0.7,
  "listingType": "fixed", // or "auction"
  "duration": 7, // days
  "message": "Unable to attend, selling at fair price"
}
```

#### Purchase from Marketplace
```http
POST /api/marketplace/listings/{listingId}/purchase
```

Request Body:
```json
{
  "buyerMessage": "Looking forward to the event!"
}
```

### Analytics API

#### Event Analytics
```http
GET /api/events/{eventId}/analytics
```

Response:
```json
{
  "salesData": {
    "totalSold": 7500,
    "totalRevenue": 1250.5,
    "averagePrice": 0.167,
    "salesByDay": [
      { "date": "2025-06-01", "tickets": 150, "revenue": 25.5 },
      { "date": "2025-06-02", "tickets": 200, "revenue": 34.2 }
    ]
  },
  "demographics": {
    "ageGroups": {
      "18-25": 35,
      "26-35": 40,
      "36-45": 20,
      "46+": 5
    },
    "locations": {
      "New York": 45,
      "California": 20,
      "Florida": 15,
      "Other": 20
    }
  },
  "marketplaceActivity": {
    "activeListings": 25,
    "averageResalePrice": 0.85,
    "resaleVolume": 150
  }
}
```

### User API

#### Get User Profile
```http
GET /api/users/{walletAddress}
```

Response:
```json
{
  "walletAddress": "0xabcd...efgh",
  "username": "musiclover123",
  "email": "user@example.com",
  "profileImageUrl": "https://ipfs.io/ipfs/QmProfile...",
  "bio": "Music enthusiast and NFT collector",
  "socialLinks": {
    "twitter": "https://twitter.com/musiclover123",
    "instagram": "https://instagram.com/musiclover123"
  },
  "isVerified": true,
  "stats": {
    "ticketsPurchased": 25,
    "ticketsSold": 8,
    "eventsAttended": 20,
    "reputation": 4.9
  },
  "badges": [
    "early_adopter",
    "vip_collector",
    "festival_goer"
  ],
  "joinDate": "2024-03-15T09:00:00Z"
}
```

#### Update User Profile
```http
PUT /api/users/{walletAddress}
```

Request Body:
```json
{
  "username": "musiclover123",
  "email": "user@example.com",
  "bio": "Music enthusiast and NFT collector",
  "socialLinks": {
    "twitter": "https://twitter.com/musiclover123",
    "instagram": "https://instagram.com/musiclover123"
  }
}
```

---

## Troubleshooting

### Common Issues

#### Wallet Connection Problems

**Issue**: MetaMask not connecting
**Solutions**:
1. Ensure MetaMask is installed and updated
2. Check if site is added to MetaMask's blocked list
3. Try connecting manually through MetaMask interface
4. Clear browser cache and cookies
5. Disable other wallet extensions temporarily

```javascript
// Debug wallet connection
const debugWalletConnection = async () => {
  if (typeof window.ethereum === 'undefined') {
    console.error('MetaMask not installed');
    return;
  }
  
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    console.log('Connected accounts:', accounts);
  } catch (error) {
    console.error('Connection error:', error);
    
    if (error.code === 4001) {
      console.log('User rejected connection');
    } else if (error.code === -32002) {
      console.log('Connection request already pending');
    }
  }
};
```

#### Transaction Failures

**Issue**: Transaction failing with "insufficient funds"
**Solutions**:
1. Check ETH/MATIC balance for gas fees
2. Increase gas limit in MetaMask settings
3. Wait for network congestion to reduce
4. Use a higher gas price

**Issue**: Transaction pending for too long
**Solutions**:
1. Check network status on Etherscan/PolygonScan
2. Cancel and retry with higher gas price
3. Use "Speed Up" option in MetaMask

```javascript
// Transaction error handling
const handleTransactionError = (error) => {
  if (error.code === 4001) {
    return 'Transaction rejected by user';
  } else if (error.code === -32603) {
    return 'Transaction failed - check gas limit';
  } else if (error.message.includes('insufficient funds')) {
    return 'Insufficient funds for gas fees';
  } else if (error.message.includes('nonce too high')) {
    return 'Nonce error - reset MetaMask account';
  }
  return 'Transaction failed - please try again';
};
```

#### Smart Contract Interaction Issues

**Issue**: Contract function calls failing
**Solutions**:
1. Verify contract address is correct
2. Check if you're on the right network
3. Ensure contract is not paused
4. Verify function parameters are correct

```javascript
// Contract interaction debugging
const debugContractCall = async (contract, functionName, params) => {
  try {
    // First, try to call the function (read-only)
    const result = await contract.methods[functionName](...params).call();
    console.log('Function would return:', result);
    
    // Then estimate gas
    const gasEstimate = await contract.methods[functionName](...params).estimateGas();
    console.log('Estimated gas:', gasEstimate);
    
    // Finally, send transaction
    const tx = await contract.methods[functionName](...params).send({
      from: userAddress,
      gas: gasEstimate * 1.2 // Add 20% buffer
    });
    
    return tx;
  } catch (error) {
    console.error('Contract call failed:', error);
    throw error;
  }
};
```

#### IPFS Content Loading

**Issue**: Images or metadata not loading
**Solutions**:
1. Check IPFS gateway status
2. Try alternative IPFS gateways
3. Verify IPFS hash is correct
4. Check if content was pinned properly

```javascript
// IPFS fallback gateways
const ipfsGateways = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/'
];

const loadIPFSContent = async (hash) => {
  for (const gateway of ipfsGateways) {
    try {
      const response = await fetch(`${gateway}${hash}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Gateway ${gateway} failed:`, error);
    }
  }
  throw new Error('All IPFS gateways failed');
};
```

### Network Issues

#### Wrong Network Connected

```javascript
// Network switching helper
const switchNetwork = async (chainId) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }]
    });
  } catch (error) {
    if (error.code === 4902) {
      // Network not added to MetaMask
      await addNetwork(chainId);
    } else {
      throw error;
    }
  }
};

const addNetwork = async (chainId) => {
  const networkConfigs = {
    1: {
      chainName: 'Ethereum Mainnet',
      rpcUrls: ['https://mainnet.infura.io/v3/YOUR_KEY'],
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
    },
    137: {
      chainName: 'Polygon Mainnet',
      rpcUrls: ['https://polygon-rpc.com'],
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
    }
  };

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [networkConfigs[chainId]]
  });
};
```

### Performance Optimization

#### Slow Page Loading

**Solutions**:
1. Implement lazy loading for components
2. Optimize image sizes and formats
3. Use CDN for static assets
4. Implement caching strategies

```javascript
// Lazy loading implementation
import { lazy, Suspense } from 'react';

const EventDetails = lazy(() => import('./components/EventDetails'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EventDetails />
  </Suspense>
);
```

#### High Gas Fees

**Solutions**:
1. Batch multiple operations
2. Use Layer 2 solutions (Polygon)
3. Time transactions during low congestion
4. Implement meta-transactions

```javascript
// Batch operations to reduce gas costs
const batchPurchase = async (eventIds, quantities) => {
  const batchContract = new web3.eth.Contract(BatchPurchaseABI, batchAddress);
  
  return await batchContract.methods.batchPurchaseTickets(
    eventIds,
    quantities
  ).send({ from: userAddress });
};
```

---

## Security & Best Practices

### Smart Contract Security

#### Access Control
```solidity
// Role-based access control
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TixoraCore is AccessControl {
    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    modifier onlyOrganizer() {
        require(hasRole(ORGANIZER_ROLE, msg.sender), "Not an organizer");
        _;
    }
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not an admin");
        _;
    }
}
```

#### Reentrancy Protection
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TixoraCore is ReentrancyGuard {
    function purchaseTicket(uint256 eventId) 
        external 
        payable 
        nonReentrant 
    {
        // Purchase logic here
        _safeMint(msg.sender, ticketId);
        
        // External calls at the end
        payable(organizer).transfer(amount);
    }
}
```

#### Input Validation
```solidity
function createEvent(
    string memory name,
    uint256 startDate,
    uint256 ticketPrice
) external {
    require(bytes(name).length > 0, "Name cannot be empty");
    require(startDate > block.timestamp, "Start date must be in future");
    require(ticketPrice > 0, "Price must be greater than 0");
    
    // Function logic
}
```

### Frontend Security

#### Wallet Integration Security
```javascript
// Secure wallet connection
const secureConnect = async () => {
  // Verify the provider is legitimate
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    throw new Error('Please install MetaMask');
  }
  
  // Request connection with specific permissions
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  
  // Verify the account format
  if (!Web3.utils.isAddress(accounts[0])) {
    throw new Error('Invalid account address');
  }
  
  return accounts[0];
};
```

#### Transaction Validation
```javascript
// Validate transaction parameters before sending
const validateTransaction = (params) => {
  const { to, value, data } = params;
  
  // Validate recipient address
  if (!Web3.utils.isAddress(to)) {
    throw new Error('Invalid recipient address');
  }
  
  // Validate value
  if (value && (isNaN(value) || value < 0)) {
    throw new Error('Invalid transaction value');
  }
  
  // Validate contract interaction
  if (data && !data.startsWith('0x')) {
    throw new Error('Invalid transaction data');
  }
  
  return true;
};
```

#### Data Sanitization
```javascript
// Sanitize user inputs
import DOMPurify from 'dompurify';

const sanitizeInput = (input) => {
  // Remove potentially harmful characters
  const cleaned = DOMPurify.sanitize(input);
  
  // Additional validation
  if (cleaned.length > 1000) {
    throw new Error('Input too long');
  }
  
  return cleaned;
};
```

### User Privacy & Data Protection

#### Data Encryption
```javascript
// Encrypt sensitive user data
import CryptoJS from 'crypto-js';

const encryptUserData = (data, password) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    password
  ).toString();
  
  return encrypted;
};

const decryptUserData = (encryptedData, password) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, password);
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};
```

#### Anonymous Analytics
```javascript
// Privacy-preserving analytics
const trackEvent = (eventName, properties = {}) => {
  // Remove personally identifiable information
  const sanitizedProps = {
    ...properties,
    userId: null, // Don't track user IDs
    walletAddress: null, // Don't track wallet addresses
    timestamp: Date.now()
  };
  
  // Send to analytics service
  analytics.track(eventName, sanitizedProps);
};
```

### Operational Security

#### Regular Security Audits
- Schedule monthly security reviews
- Use automated vulnerability scanners
- Conduct penetration testing
- Monitor for suspicious activities

#### Incident Response Plan
1. **Detection**: Automated monitoring and alerting
2. **Assessment**: Rapid impact evaluation
3. **Containment**: Immediate threat isolation
4. **Recovery**: System restoration procedures
5. **Documentation**: Incident logging and reporting

#### Backup and Recovery
```javascript
// Automated backup system
const createBackup = async () => {
  const backup = {
    timestamp: Date.now(),
    contracts: await getContractStates(),
    userData: await exportUserData(),
    eventData: await exportEventData()
  };
  
  // Store in multiple locations
  await storeBackup(backup, 'primary');
  await storeBackup(backup, 'secondary');
  await storeBackup(backup, 'offsite');
};
```

### Compliance & Legal

#### GDPR Compliance
- Implement data portability features
- Provide clear consent mechanisms
- Enable data deletion requests
- Maintain audit logs

#### Anti-Money Laundering (AML)
- Implement transaction monitoring
- Set transaction limits
- Require identity verification for large purchases
- Report suspicious activities

#### Terms of Service & Privacy Policy
- Regular legal review and updates
- Clear user consent flows
- Transparent data usage policies
- Proper dispute resolution mechanisms

---

## Conclusion

This comprehensive documentation covers all aspects of the Tixora dApp, from basic user interactions to advanced developer features. The platform represents a significant advancement in event ticketing technology, leveraging blockchain's transparency and security to create a better experience for all stakeholders.

### Key Benefits Summary
- **For Users**: Authentic tickets, fair pricing, enhanced experiences
- **For Organizers**: Reduced fraud, better analytics, ongoing royalties
- **For Developers**: Extensible architecture, comprehensive APIs, security best practices

### Future Roadmap
- Mobile app development
- Multi-chain support expansion
- AI-powered fraud detection
- Enhanced social features
- Integration with major event platforms

### Support & Resources
- **Documentation**: [https://docs.tixora.com](https://docs.tixora.com)
- **Developer Support**: [dev-support@tixora.com](mailto:dev-support@tixora.com)
- **Community Discord**: [https://discord.gg/tixora](https://discord.gg/tixora)
- **GitHub Repository**: [https://github.com/tixora/tixora-dapp](https://github.com/tixora/tixora-dapp)

For additional support or questions not covered in this documentation, please reach out to our support team or join our community channels. Key Features
- **NFT-Based Tickets**: Each ticket is a unique Non-Fungible Token (NFT) stored on the blockchain
- **Anti-Fraud Protection**: Blockchain verification ensures ticket authenticity
- **Secondary Market Control**: Smart contract-based resale with royalty distribution
- **Enhanced Utility**: Tickets can include exclusive content, merchandise, and experiences
- **Transparent Pricing**: No hidden fees with blockchain transparency
- **Cross-Platform Compatibility**: Works across different devices and wallets

### Technology Stack
- **Frontend**: React.js with Web3 integration
- **Blockchain**: Ethereum/Polygon network
- **Smart Contracts**: Solidity-based contracts
- **Storage**: IPFS for metadata and media
- **Wallet Integration**: MetaMask, WalletConnect, Coinbase Wallet

---

## Getting Started

### Prerequisites
1. **Web3 Wallet**: MetaMask, Coinbase Wallet, or WalletConnect compatible wallet
2. **Cryptocurrency**: ETH/MATIC for transaction fees
3. **Modern Browser**: Chrome, Firefox, Safari, or Edge with Web3 support

### Initial Setup

#### 1. Install MetaMask
```bash
# Visit https://metamask.io/download/
# Install browser extension or mobile app
```

#### 2. Connect to Tixora
1. Navigate to `https://tixora-tickets.vercel.app/`
2. Click "Connect Wallet"
3. Select your preferred wallet
4. Approve connection request
5. Ensure you're on the correct network (Ethereum Mainnet/Polygon)

#### 3. Fund Your Wallet
- Purchase ETH/MATIC from exchanges like Coinbase, Binance, or Kraken
- Transfer funds to your wallet address
- Keep some tokens for transaction fees (gas)

---

## User Guide

### Browsing Events

#### Discovering Events
1. **Home Page**: Browse featured and upcoming events
2. **Categories**: Filter by event type (Music, Sports, Conferences, etc.)
3. **Search**: Use search bar to find specific events or artists
4. **Date Filter**: Filter events by date range
5. **Location Filter**: Find events in specific locations

#### Event Details Page
- **Event Information**: Date, time, venue, description
- **Ticket Types**: Different tiers with varying prices and benefits
- **Seat Map**: Interactive seating chart (if applicable)
- **Artist/Organizer Profile**: Information about event creators
- **Social Proof**: Reviews and ratings from previous attendees

### Purchasing Tickets

#### Ticket Purchase Flow
1. **Select Event**: Click on desired event
2. **Choose Tickets**: Select ticket type and quantity
3. **Review Order**: Confirm details and total cost
4. **Connect Wallet**: Ensure wallet is connected
5. **Approve Transaction**: Confirm blockchain transaction
6. **Receive NFT**: Ticket NFT minted to your wallet

#### Payment Process
```javascript
// Example transaction approval
const purchaseTicket = async (eventId, ticketType, quantity) => {
  try {
    // Approve spending (if using ERC-20 tokens)
    await token.approve(contractAddress, totalAmount);
    
    // Purchase ticket
    const tx = await contract.purchaseTicket(
      eventId, 
      ticketType, 
      quantity,
      { value: ethAmount }
    );
    
    await tx.wait();
    console.log('Ticket purchased successfully!');
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};
```

### Managing Your Tickets

#### View Your Tickets
1. Navigate to "My Tickets" section
2. View all owned ticket NFTs
3. Check ticket details and metadata
4. Verify authenticity on blockchain

#### Ticket Actions
- **View Ticket**: Display full ticket information
- **Transfer**: Send ticket to another wallet address
- **Resell**: List ticket on secondary market
- **Download**: Save ticket as PDF/image
- **Verify**: Check ticket authenticity

### Secondary Market

#### Selling Tickets
1. Go to "My Tickets"
2. Click "Resell" on desired ticket
3. Set sale price
4. Choose sale type (fixed price/auction)
5. Confirm listing transaction
6. Ticket appears on marketplace

#### Buying from Secondary Market
1. Browse "Marketplace" section
2. Filter by event, price, or date
3. Select desired ticket
4. Review seller reputation
5. Complete purchase transaction

---

## Event Organizer Guide

### Creating an Event

#### Event Setup Process
1. **Register as Organizer**: Complete KYC verification
2. **Event Details**: Fill in comprehensive event information
3. **Venue Setup**: Configure seating chart and capacity
4. **Ticket Tiers**: Define different ticket types and pricing
5. **Media Upload**: Add images, videos, and promotional content
6. **Smart Contract Deployment**: Deploy event-specific contract

#### Event Configuration
```javascript
// Example event creation parameters
const eventConfig = {
  name: "Summer Music Festival 2025",
  description: "Three days of amazing music and entertainment",
  venue: "Central Park Amphitheater",
  startDate: "2025-07-15T18:00:00Z",
  endDate: "2025-07-17T23:00:00Z",
  totalSupply: 10000,
  ticketTypes: [
    {
      name: "General Admission",
      price: "0.1", // in ETH
      supply: 8000,
      benefits: ["Event Access", "Festival Merchandise"]
    },
    {
      name: "VIP Pass",
      price: "0.5",
      supply: 2000,
      benefits: ["Event Access", "Backstage Tours", "Artist Meet & Greet"]
    }
  ],
  royaltyPercentage: 5, // 5% on secondary sales
  maxResalePrice: 200 // Max 200% of original price
};
```

### Revenue Management

#### Revenue Streams
1. **Primary Sales**: Direct ticket sales revenue
2. **Secondary Market**: Royalties from resales
3. **Premium Features**: VIP experiences and add-ons
4. **Merchandise**: NFT-linked physical goods
5. **Sponsorships**: Branded content and partnerships

#### Analytics Dashboard
- **Sales Metrics**: Real-time sales tracking
- **Attendance Predictions**: AI-powered forecasting
- **Customer Demographics**: Audience insights
- **Revenue Breakdown**: Detailed financial reporting
- **Engagement Metrics**: Social media and app interactions

### Event Management Tools

#### Pre-Event
- **Marketing Tools**: Social media integration and campaigns
- **Early Bird Sales**: Time-limited discount mechanisms
- **Whitelist Management**: Exclusive access for VIP customers
- **Capacity Planning**: Dynamic pricing based on demand

#### During Event
- **Real-time Scanning**: QR code and NFC ticket validation
- **Attendance Tracking**: Live headcount and entry monitoring
- **Emergency Protocols**: Contact systems for attendees
- **Live Updates**: Push notifications to ticket holders

#### Post-Event
- **Feedback Collection**: Automated survey systems
- **Content Sharing**: Exclusive post-event content delivery
- **Community Building**: Continued engagement with attendees
- **Performance Analysis**: Comprehensive event reporting

---

## Technical Architecture

### System Components

#### Frontend Architecture
```
├── src/
│   ├── components/
│   │   ├── EventCard/
│   │   ├── TicketPurchase/
│   │   ├── WalletConnection/
│   │   └── TicketManagement/
│   ├── hooks/
│   │   ├── useWeb3.js
│   │   ├── useContract.js
│   │   └── useTickets.js
│   ├── services/
│   │   ├── web3Service.js
│   │   ├── ipfsService.js
│   │   └── apiService.js
│   └── contracts/
│       ├── TixoraTicket.json
│       └── TixoraMarketplace.json
```

#### Smart Contract Structure
```solidity
// Core contracts overview
contract TixoraCore {
    // Main ticketing logic
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    
    function createEvent(EventParams memory params) external;
    function purchaseTicket(uint256 eventId, uint256 quantity) external payable;
    function transferTicket(uint256 tokenId, address to) external;
}

contract TixoraMarketplace {
    // Secondary market functionality
    mapping(uint256 => Listing) public listings;
    
    function listTicket(uint256 tokenId, uint256 price) external;
    function purchaseFromMarketplace(uint256 listingId) external payable;
}
```

### Blockchain Integration

#### Network Configuration
```javascript
// Network configurations
const networks = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpc: 'https://mainnet.infura.io/v3/YOUR_KEY',
    contracts: {
      TixoraCore: '0x1234...5678',
      TixoraMarketplace: '0x8765...4321'
    }
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpc: 'https://polygon-rpc.com',
    contracts: {
      TixoraCore: '0xabcd...efgh',
      TixoraMarketplace: '0xijkl...mnop'
    }
  }
};
```

#### Web3 Integration
```javascript
// Web3 service implementation
class Web3Service {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.contracts = {};
  }

  async connect() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.account = (await this.web3.eth.getAccounts())[0];
      await this.loadContracts();
    }
  }

  async loadContracts() {
    const networkId = await this.web3.eth.net.getId();
    // Load contract instances
    this.contracts.core = new this.web3.eth.Contract(
      TixoraCoreABI,
      networks[networkId].contracts.TixoraCore
    );
  }
}
```

### IPFS Integration

#### Metadata Storage
```javascript
// IPFS service for metadata storage
class IPFSService {
  constructor() {
    this.ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
  }

  async uploadTicketMetadata(ticketData) {
    const metadata = {
      name: ticketData.eventName,
      description: ticketData.description,
      image: ticketData.imageUrl,
      attributes: [
        {
          trait_type: "Event Date",
          value: ticketData.eventDate
        },
        {
          trait_type: "Seat Number",
          value: ticketData.seatNumber
        },
        {
          trait_type: "Ticket Type",
          value: ticketData.ticketType
        }
      ]
    };

    const result = await this.ipfs.add(JSON.stringify(metadata));
    return `ipfs://${result.cid}`;
  }
}
```

---

## Smart Contract Integration

### Core Contract Functions

#### Event Creation
```solidity
function createEvent(
    string memory name,
    string memory description,
    uint256 startDate,
    uint256 endDate,
    uint256 totalSupply,
    uint256 ticketPrice,
    uint256 royaltyPercentage
) external onlyOrganizer returns (uint256) {
    uint256 eventId = eventCounter++;
    
    events[eventId] = Event({
        id: eventId,
        organizer: msg.sender,
        name: name,
        description: description,
        startDate: startDate,
        endDate: endDate,
        totalSupply: totalSupply,
        soldTickets: 0,
        ticketPrice: ticketPrice,
        royaltyPercentage: royaltyPercentage,
        isActive: true
    });
    
    emit EventCreated(eventId, msg.sender, name);
    return eventId;
}
```

#### Ticket Purchase
```solidity
function purchaseTicket(
    uint256 eventId,
    uint256 quantity,
    string memory seatInfo
) external payable {
    Event storage event = events[eventId];
    require(event.isActive, "Event is not active");
    require(event.soldTickets + quantity <= event.totalSupply, "Not enough tickets");
    require(msg.value >= event.ticketPrice * quantity, "Insufficient payment");
    
    for (uint256 i = 0; i < quantity; i++) {
        uint256 ticketId = ticketCounter++;
        tickets[ticketId] = Ticket({
            id: ticketId,
            eventId: eventId,
            owner: msg.sender,
            seatInfo: seatInfo,
            isUsed: false,
            purchaseDate: block.timestamp
        });
        
        _mint(msg.sender, ticketId);
        emit TicketPurchased(ticketId, eventId, msg.sender);
    }
    
    event.soldTickets += quantity;
    
    // Transfer payment to organizer (minus platform fee)
    uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENTAGE) / 100;
    uint256 organizerAmount = msg.value - platformFee;
    
    payable(event.organizer).transfer(organizerAmount);
    payable(owner()).transfer(platformFee);
}
```

#### Secondary Market
```solidity
function listTicketForSale(
    uint256 ticketId,
    uint256 price
) external {
    require(ownerOf(ticketId) == msg.sender, "Not ticket owner");
    require(!tickets[ticketId].isUsed, "Ticket already used");
    
    uint256 listingId = listingCounter++;
    listings[listingId] = Listing({
        id: listingId,
        ticketId: ticketId,
        seller: msg.sender,
        price: price,
        isActive: true,
        listingDate: block.timestamp
    });
    
    emit TicketListed(listingId, ticketId, msg.sender, price);
}

function purchaseFromListing(uint256 listingId) external payable {
    Listing storage listing = listings[listingId];
    require(listing.isActive, "Listing not active");
    require(msg.value >= listing.price, "Insufficient payment");
    
    uint256 ticketId = listing.ticketId;
    uint256 eventId = tickets[ticketId].eventId;
    Event storage event = events[eventId];
    
    // Calculate royalties
    uint256 royalty = (listing.price * event.royaltyPercentage) / 100;
    uint256 platformFee = (listing.price * PLATFORM_FEE_PERCENTAGE) / 100;
    uint256 sellerAmount = listing.price - royalty - platformFee;
    
    // Transfer payments
    payable(listing.seller).transfer(sellerAmount);
    payable(event.organizer).transfer(royalty);
    payable(owner()).transfer(platformFee);
    
    // Transfer ticket ownership
    _transfer(listing.seller, msg.sender, ticketId);
    tickets[ticketId].owner = msg.sender;
    
    listing.isActive = false;
    emit TicketSold(listingId, ticketId, msg.sender, listing.price);
}
```

### Event Structures
```solidity
struct Event {
    uint256 id;
    address organizer;
    string name;
    string description;
    uint256 startDate;
    uint256 endDate;
    uint256 totalSupply;
    uint256 soldTickets;
    uint256 ticketPrice;
    uint256 royaltyPercentage;
    bool isActive;
}

struct Ticket {
    uint256 id;
    uint256 eventId;
    address owner;
    string seatInfo;
    bool isUsed;
    uint256 purchaseDate;
}

struct Listing {
    uint256 id;
    uint256 ticketId;
    address seller;
    uint256 price;
    bool isActive;
    uint256 listingDate;
}
```

---

## Developer Guide

### Local Development Setup

#### Prerequisites
```bash
# Install Node.js (v16 or higher)
node --version
npm --version

# Install Git
git --version

# Install Hardhat (for smart contract development)
npm install --global hardhat
```

#### Project Setup
```bash
# Clone the repository
git clone https://github.com/your-username/tixora-dapp.git
cd tixora-dapp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

#### Environment Configuration
```env
# .env file
REACT_APP_INFURA_KEY=your_infura_project_id
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key
REACT_APP_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
REACT_APP_NETWORK_ID=1
REACT_APP_API_BASE_URL=https://api.tixora.com
```

### Smart Contract Development

#### Contract Compilation
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

#### Testing Framework
```javascript
// test/TixoraCore.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TixoraCore", function () {
  let tixoraCore;
  let owner, organizer, buyer;

  beforeEach(async function () {
    [owner, organizer, buyer] = await ethers.getSigners();
    
    const TixoraCore = await ethers.getContractFactory("TixoraCore");
    tixoraCore = await TixoraCore.deploy();
    await tixoraCore.deployed();
  });

  it("Should create an event", async function () {
    const tx = await tixoraCore.connect(organizer).createEvent(
      "Test Event",
      "Test Description",
      Math.floor(Date.now() / 1000) + 86400, // Tomorrow
      Math.floor(Date.now() / 1000) + 172800, // Day after tomorrow
      100,
      ethers.utils.parseEther("0.1"),
      5
    );

    await tx.wait();
    const event = await tixoraCore.events(0);
    expect(event.name).to.equal("Test Event");
  });

  it("Should purchase a ticket", async function () {
    // Create event first
    await tixoraCore.connect(organizer).createEvent(
      "Test Event",
      "Test Description",
      Math.floor(Date.now() / 1000) + 86400,
      Math.floor(Date.now() / 1000) + 172800,
      100,
      ethers.utils.parseEther("0.1"),
      5
    );

    // Purchase ticket
    const tx = await tixoraCore.connect(buyer).purchaseTicket(
      0,
      1,
      "Seat A1",
      { value: ethers.utils.parseEther("0.1") }
    );

    await tx.wait();
    expect(await tixoraCore.ownerOf(0)).to.equal(buyer.address);
  });
});
```

### Frontend Development

#### Component Structure
```jsx
// components/EventCard/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatPrice } from '../../utils/helpers';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    navigate(`/events/${event.id}/purchase`);
  };

  return (
    <div className="event-card">
      <img src={event.imageUrl} alt={event.name} />
      <div className="event-info">
        <h3>{event.name}</h3>
        <p>{event.description}</p>
        <div className="event-details">
          <span>{formatDate(event.startDate)}</span>
          <span>{event.venue}</span>
          <span>From {formatPrice(event.minPrice)} ETH</span>
        </div>
        <button onClick={handlePurchase} className="purchase-btn">
          Buy Tickets
        </button>
      </div>
    </div>
  );
};

export default EventCard;
```

#### Custom Hooks
```javascript
// hooks/useWeb3.js
import { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { Web3Context } from '../contexts/Web3Context';

export const useWeb3 = () => {
  const { web3, account, connect, disconnect } = useContext(Web3Context);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    web3,
    account,
    connectWallet,
    disconnect,
    isConnecting,
    isConnected: !!account
  };
};
```

#### Contract Interaction Service
```javascript
// services/contractService.js
import Web3 from 'web3';
import TixoraCoreABI from '../contracts/TixoraCore.json';

class ContractService {
  constructor(web3, contractAddress) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(TixoraCoreABI.abi, contractAddress);
  }

  async createEvent(eventData, fromAddress) {
    const tx = await this.contract.methods.createEvent(
      eventData.name,
      eventData.description,
      eventData.startDate,
      eventData.endDate,
      eventData.totalSupply,
      this.web3.utils.toWei(eventData.ticketPrice.toString(), 'ether'),
      eventData.royaltyPercentage
    ).send({ from: fromAddress });

    return tx;
  }

  async purchaseTicket(eventId, quantity, seatInfo, fromAddress, value) {
    const tx = await this.contract.methods.purchaseTicket(
      eventId,
      quantity,
      seatInfo
    ).send({ 
      from: fromAddress, 
      value: this.web3.utils.toWei(value.toString(), 'ether')
    });

    return tx;
  }

  async getEvent(eventId) {
    return await this.contract.methods.events(eventId).call();
  }

  async getUserTickets(userAddress) {
    const balance = await this.contract.methods.balanceOf(userAddress).call();
    const tickets = [];

    for (let i = 0; i < balance; i++) {
      const tokenId = await this.contract.methods.tokenOfOwnerByIndex(
        userAddress, 
        i
      ).call();
      const ticket = await this.contract.methods.tickets(tokenId).call();
      tickets.push(ticket);
    }

    return tickets;
  }
}

export default ContractService;
```

### Database Schema (Off-chain data)

#### Event Metadata
```sql
-- Events table for off-chain metadata
CREATE TABLE events (
    id BIGINT PRIMARY KEY,
    contract_address VARCHAR(42) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_address VARCHAR(42) NOT NULL,
    venue VARCHAR(255),
    image_url VARCHAR(500),
    category VARCHAR(100),
    tags JSON,
    social_links JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ticket metadata
CREATE TABLE ticket_metadata (
    token_id BIGINT PRIMARY KEY,
    event_id BIGINT,
    metadata_uri VARCHAR(500),
    seat_section VARCHAR(50),
    seat_row VARCHAR(10),
    seat_number VARCHAR(10),
    ticket_type VARCHAR(100),
    benefits JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- User profiles
CREATE TABLE user_profiles (
    wallet_address VARCHAR(42) PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(255),
    profile_image_url VARCHAR(500),
    bio TEXT,
    social_links JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Reference

### Authentication
All API requests require a valid JWT token or wallet signature for authentication.

```javascript
// Authentication header
headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

### Events API

#### Get All Events
```http
GET /api/events
```

Query Parameters:
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20, max: 100)
- `category` (string): Filter by event category
- `location` (string): Filter by location
- `date_from` (string): Start date filter (ISO 8601)
- `date_to` (string): End date filter (ISO 8601)
- `price_min` (number): Minimum price filter
- `price_max` (number): Maximum price filter
- `search` (string): Search query

Response:
```json
{
  "events": [
    {
      "id": 1,
      "name": "Summer Music Festival",
      "description": "Three days of amazing music",
      "organizer": "0x1234...5678",
      "venue": "Central Park",
      "location": "New York, NY",
      "startDate": "2025-07-15T18:00:00Z",
      "endDate": "2025-07-17T23:00:00Z",
      "imageUrl": "https://ipfs.io/ipfs/QmX...",
      "category": "music",
      "totalSupply": 10000,
      "soldTickets": 7500,
      "minPrice": 0.1,
      "maxPrice": 0.5,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### Get Event by ID
```http
GET /api/events/{eventId}
```

Response:
```json
{
  "id": 1,
  "name": "Summer Music Festival",
  "description": "Three days of amazing music and entertainment",
  "organizer": "0x1234...5678",
  "venue": "Central Park Amphitheater",
  "location": "New York, NY",
  "startDate": "2025-07-15T18:00:00Z",
  "endDate": "2025-07-17T23:00:00Z",
  "imageUrl": "https://ipfs.io/ipfs/QmX...",
  "category": "music",
  "tags": ["festival", "outdoor", "multi-day"],
  "totalSupply": 10000,
  "soldTickets": 7500,
  "ticketTypes": [
    {
      "name": "General Admission",
      "price": 0.1,
      "supply": 8000,
      "sold": 6000,
      "benefits": ["Event Access", "Festival Merchandise"]
    },
    {
      "name": "VIP Pass",
      "price": 0.5,
      "supply": 2000,
      "sold": 1500,
      "benefits": ["Event Access", "Backstage Tours", "Artist Meet & Greet"]
    }
  ],
  "socialLinks": {
    "website": "https://summermusicfest.com",
    "twitter": "https://twitter.com/summermusicfest",
    "instagram": "https://instagram.com/summermusicfest"
  },
  "isActive": true
}
```

#### Create Event
```http
POST /api/events
```

Request Body:
```json
{
  "name": "Summer Music Festival",
  "description": "Three days of amazing music",
  "venue": "Central Park Amphitheater",
  "location": "New York, NY",
  "startDate": "2025-07-15T18:00:00Z",
  "endDate": "2025-07-17T23:00:00Z",
  "imageUrl": "https://ipfs.io/ipfs/QmX...",
  "category": "music",
  "tags": ["festival", "outdoor", "multi-day"],
  "totalSupply": 10000,
  "ticketTypes": [
    {
      "name": "General Admission",
      "price": 0.1,
      "supply": 8000,
      "benefits": ["Event Access", "Festival Merchandise"]
    }
  ],
  "royaltyPercentage": 5,
  "maxResalePrice": 200
}
```

###