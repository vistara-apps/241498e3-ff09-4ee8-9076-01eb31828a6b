'use client';

import { parseUnits, formatUnits, createPublicClient, http } from 'viem';
import type { WalletClient, PublicClient } from 'viem';
import { base } from 'viem/chains';
import { withPaymentInterceptor } from 'x402-axios';
import axios from 'axios';
import { USDC_ADDRESS_BASE, PAYMENT_CONFIG } from './constants';
import type { PaymentRequest, PaymentResponse } from './types';

// ERC-20 USDC ABI (simplified for transfer and approve)
const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Create a public client for Base network
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export class PaymentService {
  private walletClient: WalletClient;

  constructor(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  /**
   * Check USDC balance for the connected wallet
   */
  async getUSDCBalance(): Promise<string> {
    try {
      if (!this.walletClient.account?.address) {
        throw new Error('No wallet address available');
      }

      const balance = await publicClient.readContract({
        address: USDC_ADDRESS_BASE as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [this.walletClient.account.address],
      });

      // USDC has 6 decimals
      return formatUnits(balance as bigint, 6);
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      throw new Error('Failed to fetch USDC balance');
    }
  }

  /**
   * Create a subscription payment transaction
   */
  async createSubscriptionPayment(): Promise<PaymentResponse> {
    try {
      if (!this.walletClient.account?.address) {
        throw new Error('No wallet address available');
      }

      const paymentRequest: PaymentRequest = {
        amount: PAYMENT_CONFIG.SUBSCRIPTION_PRICE,
        currency: 'USDC',
        recipient: PAYMENT_CONFIG.RECIPIENT_ADDRESS,
        description: 'PlantPal AI Monthly Subscription',
      };

      // Convert amount to USDC units (6 decimals)
      const amount = parseUnits(paymentRequest.amount, 6);

      // Check balance first
      const balance = await this.getUSDCBalance();
      const balanceNum = parseFloat(balance);
      const requiredAmount = parseFloat(paymentRequest.amount);

      if (balanceNum < requiredAmount) {
        throw new Error(`Insufficient USDC balance. Required: ${requiredAmount}, Available: ${balanceNum}`);
      }

      // Execute USDC transfer
      const hash = await this.walletClient.writeContract({
        address: USDC_ADDRESS_BASE as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [paymentRequest.recipient as `0x${string}`, amount],
        chain: base,
        account: this.walletClient.account,
      });

      return {
        transactionHash: hash,
        status: 'pending',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForConfirmation(transactionHash: string): Promise<PaymentResponse> {
    try {
      // Create standard axios instance for payment verification
      const client = axios.create({
        baseURL: '/api/payments',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Poll for transaction status
      const response = await client.get(`/status/${transactionHash}`);
      
      return {
        transactionHash,
        status: response.data.status,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Transaction confirmation error:', error);
      return {
        transactionHash,
        status: 'failed',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Handle x402 payment flow
   */
  async processX402Payment(endpoint: string, paymentData: any): Promise<any> {
    try {
      if (!this.walletClient.account) {
        throw new Error('No wallet account available for x402 payment');
      }

      // Create axios client with x402 payment interceptor
      const baseClient = axios.create({
        baseURL: '/api',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': this.walletClient.account.address,
        },
      });

      // Add x402 payment interceptor using wallet client as signer
      const x402Client = withPaymentInterceptor(baseClient, this.walletClient as any);

      // Make the x402 payment request
      const response = await x402Client.post(endpoint, paymentData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 402) {
        // Handle payment required
        const paymentInfo = error.response.data;
        console.log('Payment required:', paymentInfo);
        
        // Process payment and retry
        await this.createSubscriptionPayment();
        
        // Retry the original request with x402 interceptor
        if (!this.walletClient.account) {
          throw new Error('No wallet account available for retry');
        }
        const retryClient = withPaymentInterceptor(axios.create(), this.walletClient as any);
        const retryResponse = await retryClient.post(endpoint, paymentData);
        return retryResponse.data;
      }
      throw error;
    }
  }
}

/**
 * Utility function to check if user has sufficient USDC for subscription
 */
export async function checkSubscriptionAffordability(walletClient: WalletClient): Promise<boolean> {
  try {
    if (!walletClient.account?.address) {
      return false;
    }

    // Use the shared public client to check balance
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS_BASE as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [walletClient.account.address],
    });

    const balanceFormatted = formatUnits(balance as bigint, 6);
    const balanceNum = parseFloat(balanceFormatted);
    const requiredAmount = parseFloat(PAYMENT_CONFIG.SUBSCRIPTION_PRICE);
    
    return balanceNum >= requiredAmount;
  } catch (error) {
    console.error('Error checking affordability:', error);
    return false;
  }
}