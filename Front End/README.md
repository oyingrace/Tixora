# Tixora — Decentralized NFT Ticketing Platform

Tixora is a blockchain-powered ticketing solution that issues fraud-proof, verifiable NFT tickets for events. It eliminates ticket forgery, ensures transparency, and gives attendees permanent digital ownership through on-chain verification.

Live Demo: [https://tixora-tickets.vercel.app/](https://tixora-tickets.vercel.app/)

## Table of Contents

* Overview
* Features
* How It Works
* System Architecture
* Data Models
* User Guide
* Organizer Guide
* Security
* Developer Documentation
* Testing
* Limitations
* Roadmap
* License

## Overview

Tixora reimagines event ticketing using blockchain technology. Each ticket is minted as a unique NFT, enabling authenticity, on-chain verification, unrestricted transfers, and fraud-resistant resales. Event organizers keep all ticket revenue with no platform fees.

## API Documentation

### Overview

Tixora provides a RESTful API for interacting with events, tickets, orders, and authentication flows. The API follows standard JSON request/response patterns and all endpoints are versioned under `/api`.

This documentation includes:

* Full endpoint descriptions
* Request and response examples
* Authentication flow
* Error codes
* Rate limiting behavior
* OpenAPI/Swagger specification
* Interactive API Explorer

---

## OpenAPI / Swagger Specification

A complete Swagger UI is available at:

```
/api/docs
```

This interactive explorer allows you to make live requests, inspect schemas, and understand response structures.

The raw OpenAPI JSON is available at:

```
/api/docs/json
```

---

## Authentication

Tixora uses **JWT-based authentication**.

### Steps:

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`.
2. Server returns a signed JWT.
3. Clients must include the JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

4. Token is required for all protected endpoints.

### Token Expiration

* Access tokens last: **1 hour**
* Refresh tokens (if used): **30 days**

---

## Rate Limiting

To maintain stability, Tixora enforces rate limits.

### Default Limits:

* **100 requests per minute per IP**
* Auth routes: **20 requests per minute**

### Headers Returned

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1712345678
```

On limit exceeded:

```
HTTP 429 Too Many Requests
```

---

## Error Response Format

All errors follow a unified structure:

```
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email is required",
    "details": null
  }
}
```

### Common Error Codes

| Code            | Meaning                  |
| --------------- | ------------------------ |
| `INVALID_INPUT` | Validation failed        |
| `UNAUTHORIZED`  | Invalid or missing token |
| `FORBIDDEN`     | User lacks permission    |
| `NOT_FOUND`     | Resource doesn’t exist   |
| `RATE_LIMITED`  | Too many requests        |
| `SERVER_ERROR`  | Unhandled exception      |

---

## API Endpoints

### **Auth Endpoints**

#### **POST /api/auth/register**

Registers a new user.

**Request:**

```
{
  "name": "Ibrahim",
  "email": "ibrahim@example.com",
  "password": "password123"
}
```

**Response:**

```
{
  "success": true,
  "token": "<jwt-token>",
  "user": {
    "id": "123",
    "name": "Ibrahim",
    "email": "ibrahim@example.com"
  }
}
```

---

#### **POST /api/auth/login**

Logs in a user.

**Request:**

```
{
  "email": "ibrahim@example.com",
  "password": "password123"
}
```

**Response:**

```
{
  "success": true,
  "token": "<jwt-token>"
}
```

---

### **Event Endpoints**

#### **GET /api/events**

Returns all events.

**Response:**

```
[
  {
    "id": "evt_123",
    "title": "Tech Conference",
    "venue": "Lagos",
    "date": "2025-01-20",
    "price": 5000
  }
]
```

---

#### **POST /api/events** (Protected)

Creates a new event.

**Request:**

```
{
  "title": "Blockchain Meetup",
  "venue": "Abuja",
  "date": "2025-02-10",
  "price": 3000
}
```

**Response:**

```
{
  "success": true,
  "event": {
    "id": "evt_456",
    "title": "Blockchain Meetup"
  }
}
```

---

### **Ticket Endpoints**

#### **POST /api/tickets/book** (Protected)

Books a ticket for a user.

**Request:**

```
{
  "eventId": "evt_123",
  "quantity": 2
}
```

**Response:**

```
{
  "success": true,
  "orderId": "ord_789",
  "qrCode": "https://.../qr.png"
}
```

---

### **Order Endpoints**

#### **GET /api/orders/my** (Protected)

Returns user's orders.

**Response:**

```
[
  {
    "id": "ord_789",
    "event": "Tech Conference",
    "status": "confirmed"
  }
]
```

---

### **Admin Endpoints**

#### **POST /api/admin/scan** (Protected)

Validates a ticket QR code.

**Request:**

```
{
  "qr": "abcd1234"
}
```

**Response:**

```
{
  "valid": true,
  "ticketId": "tkt_001"
}
```

---

## Features

### NFT Tickets

Each ticket is minted as an ERC-721 NFT, ensuring authenticity and preventing duplication.

### Wallet-Based Ownership

Tickets are stored directly in the user’s wallet.

### On-Chain Verification

Event staff verify attendees by scanning a QR code tied to the NFT.

### Free Transfers and Resales

Users can sell or gift tickets freely.

### Modern UI/UX

Built with Next.js for a seamless experience.

### Zero Fees for Organizers

Organizers retain 100% of revenue.

## How It Works

1. Users browse events and connect their wallet.
2. They purchase a ticket and approve the transaction.
3. The ticket NFT is minted to their wallet.
4. Users present a QR code for on-chain verification at event check-in.
5. Tickets can be transferred or resold.

## System Architecture

Frontend (Next.js) → Wallet Integration → Smart Contracts → Blockchain → Metadata Storage (IPFS or similar)

## Data Models

### Ticket (NFT)

* tokenId
* owner
* eventId
* metadataURI
* status (active, checked-in, transferred)

### Event

* eventId
* organizer
* name
* description
* price
* ticketSupply
* date
* image

## User Guide

### Requirements

* A Web3-enabled wallet
* Sufficient gas fees

### Buying Tickets

1. Visit site
2. Connect wallet
3. Select event and ticket
4. Confirm transaction

### Using Tickets

* Display QR code for staff to scan.

### Transferring Tickets

* Open ticket details and transfer to another wallet.

## Organizer Guide

* Create events with metadata
* Set price and supply
* Mint NFT tickets
* Use on-chain verification at check-in

### Creating an Event

1. Connect wallet
2. Enter event details
3. Upload image
4. Publish event

## Security

* ERC-721 ensures uniqueness
* On-chain proof prevents duplication
* Immutable ownership history

## Developer Documentation

* TicketContract (ERC-721)
* EventFactory
* Optional marketplace
* Tech stack: Next.js, EVM blockchain, IPFS, Web3 wallets

## Testing

* Wallet connection
* Purchase flow
* QR generation
* Ticket transfers
* Contract minting and verification

## Limitations

* Requires crypto wallets
* Gas fees vary
* High-volume check-in may require optimized scanning

## Roadmap

* Fiat payments
* Mobile app
* Seat maps
* Multi-chain support
* Dynamic pricing
* Analytics dashboard

## License

MIT License
