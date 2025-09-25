import { NextRequest, NextResponse } from 'next/server';
import { PAYMENT_CONFIG, USDC_ADDRESS_BASE } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { service, walletAddress } = await request.json();

    // Check if payment is required (x402 flow)
    const paymentRequired = !await checkExistingSubscription(walletAddress);

    if (paymentRequired) {
      // Return 402 Payment Required with payment info
      return NextResponse.json(
        {
          error: 'Payment Required',
          payment: {
            amount: PAYMENT_CONFIG.SUBSCRIPTION_PRICE,
            currency: 'USDC',
            tokenAddress: USDC_ADDRESS_BASE,
            recipient: PAYMENT_CONFIG.RECIPIENT_ADDRESS,
            description: 'PlantPal AI Monthly Subscription',
            chainId: 8453, // Base mainnet
          },
        },
        { status: 402 }
      );
    }

    // If payment is not required, provide the service
    return NextResponse.json({
      success: true,
      service: service,
      message: 'Service access granted',
    });

  } catch (error) {
    console.error('X402 payment handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock function to check if user has active subscription
async function checkExistingSubscription(walletAddress: string): Promise<boolean> {
  // In a real implementation, this would check a database
  // For now, we'll simulate that no one has an active subscription
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('wallet');

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address required' },
      { status: 400 }
    );
  }

  try {
    const hasSubscription = await checkExistingSubscription(walletAddress);
    
    return NextResponse.json({
      hasSubscription,
      subscriptionDetails: hasSubscription ? {
        plan: 'monthly',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      } : null,
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}