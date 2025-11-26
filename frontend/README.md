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
