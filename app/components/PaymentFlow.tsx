'use client';

import { useState, useEffect } from 'react';
import { useWalletClient, useWaitForTransactionReceipt } from 'wagmi';
import { PaymentService, checkSubscriptionAffordability } from '@/lib/payment';
import { PAYMENT_CONFIG } from '@/lib/constants';
import type { PaymentResponse } from '@/lib/types';
import { CreditCard, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PaymentFlowProps {
  onPaymentSuccess?: (response: PaymentResponse) => void;
  onPaymentError?: (error: Error) => void;
  buttonText?: string;
  disabled?: boolean;
}

export function PaymentFlow({ 
  onPaymentSuccess, 
  onPaymentError, 
  buttonText = "Subscribe for $5.99/month",
  disabled = false 
}: PaymentFlowProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canAfford, setCanAfford] = useState<boolean | null>(null);
  
  const { data: walletClient, isLoading: isWalletLoading } = useWalletClient();
  
  const {
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
    isError: isTransactionError,
  } = useWaitForTransactionReceipt({
    hash: paymentResponse?.transactionHash as `0x${string}`,
    query: {
      enabled: !!paymentResponse?.transactionHash,
    },
  });

  // Check if user can afford subscription
  useEffect(() => {
    async function checkAffordability() {
      if (walletClient) {
        try {
          const affordable = await checkSubscriptionAffordability(walletClient);
          setCanAfford(affordable);
        } catch (error) {
          console.error('Error checking affordability:', error);
          setCanAfford(false);
        }
      }
    }

    checkAffordability();
  }, [walletClient]);

  // Handle transaction status updates
  useEffect(() => {
    if (isTransactionSuccess && paymentResponse) {
      const successResponse = {
        ...paymentResponse,
        status: 'confirmed' as const,
      };
      setPaymentResponse(successResponse);
      onPaymentSuccess?.(successResponse);
      setIsProcessing(false);
    }

    if (isTransactionError && paymentResponse) {
      const errorResponse = {
        ...paymentResponse,
        status: 'failed' as const,
      };
      setPaymentResponse(errorResponse);
      const error = new Error('Transaction failed');
      onPaymentError?.(error);
      setError('Transaction failed');
      setIsProcessing(false);
    }
  }, [isTransactionSuccess, isTransactionError, paymentResponse, onPaymentSuccess, onPaymentError]);

  const handlePayment = async () => {
    if (!walletClient) {
      setError('Please connect your wallet first');
      return;
    }

    if (canAfford === false) {
      setError(`Insufficient USDC balance. You need at least ${PAYMENT_CONFIG.SUBSCRIPTION_PRICE} USDC.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paymentService = new PaymentService(walletClient);
      const response = await paymentService.createSubscriptionPayment();
      setPaymentResponse(response);
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed');
      setIsProcessing(false);
      onPaymentError?.(error);
    }
  };

  const getButtonContent = () => {
    if (isWalletLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Loading wallet...
        </>
      );
    }

    if (!walletClient) {
      return (
        <>
          <AlertTriangle className="w-4 h-4 mr-2" />
          Connect Wallet First
        </>
      );
    }

    if (canAfford === false) {
      return (
        <>
          <XCircle className="w-4 h-4 mr-2" />
          Insufficient USDC Balance
        </>
      );
    }

    if (isProcessing || isTransactionLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Processing...
        </>
      );
    }

    if (isTransactionSuccess) {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Payment Successful!
        </>
      );
    }

    return (
      <>
        <CreditCard className="w-4 h-4 mr-2" />
        {buttonText}
      </>
    );
  };

  const isButtonDisabled = 
    disabled || 
    isWalletLoading || 
    !walletClient || 
    canAfford === false || 
    isProcessing || 
    isTransactionLoading || 
    isTransactionSuccess;

  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={isButtonDisabled}
        className={`
          w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${isTransactionSuccess 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : canAfford === false
            ? 'bg-red-600 text-white cursor-not-allowed'
            : !walletClient
            ? 'bg-yellow-600 text-white cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90 text-white hover:scale-105'
          }
          ${isButtonDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
        `}
      >
        {getButtonContent()}
      </button>

      {/* Payment Status Display */}
      {paymentResponse && (
        <div className="p-4 bg-surface border border-white/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Transaction Hash:</span>
            <a
              href={`https://basescan.org/tx/${paymentResponse.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 text-sm font-mono truncate max-w-32"
            >
              {paymentResponse.transactionHash.slice(0, 10)}...
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm">Status:</span>
            <span className={`text-sm font-medium ${
              paymentResponse.status === 'confirmed' ? 'text-green-400' :
              paymentResponse.status === 'failed' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {paymentResponse.status.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center text-red-400">
            <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Balance Info */}
      {walletClient && canAfford !== null && (
        <div className="text-xs text-text-secondary text-center">
          {canAfford ? (
            <span className="text-green-400">✓ Sufficient USDC balance detected</span>
          ) : (
            <span className="text-red-400">⚠ Insufficient USDC balance. Please add funds to your wallet.</span>
          )}
        </div>
      )}
    </div>
  );
}