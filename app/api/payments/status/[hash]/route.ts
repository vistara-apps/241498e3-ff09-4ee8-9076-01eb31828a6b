import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Create a public client for Base network
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;

    if (!hash || !hash.startsWith('0x')) {
      return NextResponse.json(
        { error: 'Invalid transaction hash' },
        { status: 400 }
      );
    }

    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({
      hash: hash as `0x${string}`,
    });

    // Determine status based on receipt
    let status: 'pending' | 'confirmed' | 'failed';
    
    if (receipt.status === 'success') {
      status = 'confirmed';
    } else if (receipt.status === 'reverted') {
      status = 'failed';
    } else {
      status = 'pending';
    }

    return NextResponse.json({
      transactionHash: hash,
      status,
      blockNumber: receipt.blockNumber.toString(),
      gasUsed: receipt.gasUsed.toString(),
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    // If transaction is not found yet, it's likely still pending
    if (error.message?.includes('not found')) {
      const resolvedParams = await params;
      return NextResponse.json({
        transactionHash: resolvedParams.hash,
        status: 'pending',
        timestamp: new Date().toISOString(),
      });
    }

    console.error('Error checking transaction status:', error);
    return NextResponse.json(
      { error: 'Failed to check transaction status' },
      { status: 500 }
    );
  }
}