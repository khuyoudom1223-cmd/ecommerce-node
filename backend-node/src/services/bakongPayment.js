import axios from 'axios';
import crypto from 'crypto';
import pkg from 'bakong-khqr';

const { BakongKHQR, khqrData, IndividualInfo } = pkg;

export function getBakongConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    baseUrl: isProduction
      ? (process.env.BAKONG_PROD_BASE_API_URL || 'https://api-bakong.nbc.gov.kh/v1')
      : (process.env.BAKONG_DEV_BASE_API_URL || 'https://sit-api-bakong.nbc.gov.kh/v1'),
    token: process.env.BAKONG_TOKEN,
    merchantId: process.env.BAKONG_MERCHANT_ID || 'soklin_chen@bkrt',
    merchantName: process.env.BAKONG_MERCHANT_NAME || 'SOKLIN CHEN',
    merchantCity: process.env.BAKONG_MERCHANT_CITY || 'Phnom Penh'
  };
}

export function createBakongPaymentReference(prefix = 'BKQR') {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

export function buildBakongKhqr({ amount, paymentReference, expirationMinutes = 5 }) {
  const { merchantId, merchantName, merchantCity } = getBakongConfig();
  const expirationTimestamp = Date.now() + expirationMinutes * 60 * 1000;

  const optionalData = {
    currency: khqrData.currency.usd,
    amount: Number.parseFloat(amount),
    billNumber: paymentReference,
    storeLabel: 'SleekCart',
    terminalLabel: 'Online Payment',
    expirationTimestamp
  };

  const individualInfo = new IndividualInfo(
    merchantId,
    merchantName,
    merchantCity,
    optionalData
  );

  const khqr = new BakongKHQR();
  const khqrResponse = khqr.generateIndividual(individualInfo);

  if (!khqrResponse || !khqrResponse.status || khqrResponse.status.code !== 0 || !khqrResponse.data) {
    throw new Error(`Bakong SDK returned invalid response: ${JSON.stringify(khqrResponse)}`);
  }

  return {
    qrString: khqrResponse.data.qr,
    md5Hash: khqrResponse.data.md5,
    expirationTimestamp
  };
}

export async function verifyBakongPayment(md5Hash) {
  const { baseUrl, token } = getBakongConfig();
  if (!token) {
    console.warn('⚠️ BAKONG_TOKEN not configured - skipping live verification');
    return null;
  }

  try {
    console.log(`📡 [BAKONG VERIFY] Calling /check_transaction_by_md5 with MD5: ${md5Hash}...`);
    const response = await axios.post(
      `${baseUrl}/check_transaction_by_md5`,
      { md5: md5Hash },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    console.log('📡 [BAKONG RESPONSE]:', JSON.stringify(response.data));
    return response.data;
  } catch (err) {
    console.error('⚠️ [Bakong API Error]', err.response?.data || err.message);
    return null;
  }
}

export function normalizeBakongResponse(rawResponse, expectedReference = '') {
  const responseCode = rawResponse?.responseCode;
  const responseData = rawResponse?.data || {};
  const status = String(responseData.status || rawResponse?.status || '').toUpperCase();
  const resolvedReference = responseData.paymentRef || responseData.externalRef || responseData.reference || responseData.billNumber || '';
  const bakongTransactionId = responseData.hash || responseData.transactionId || responseData.bakongTransactionId || '';
  const isSuccess = responseCode === 0 && (status === 'SUCCESS' || status === 'COMPLETED' || !!responseData.toAccountId);
  const isFailed = status === 'FAILED' || status === 'ERROR';
  const isPending = !isSuccess && !isFailed;

  return {
    raw: rawResponse,
    status: isSuccess ? 'SUCCESS' : isFailed ? 'FAILED' : 'PENDING',
    responseCode,
    resolvedReference,
    referenceMatches: expectedReference ? resolvedReference === expectedReference : true,
    bakongTransactionId,
    amount: Number(responseData.amount ?? responseData.transactionAmount ?? NaN),
    isSuccess,
    isFailed,
    isPending
  };
}