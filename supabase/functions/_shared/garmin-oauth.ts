/**
 * OAuth 1.0a utilities for Garmin Health API
 * Implements HMAC-SHA1 signature generation per RFC 5849
 */

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

function getTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

async function hmacSha1(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export interface OAuthParams {
  consumerKey: string;
  consumerSecret: string;
  tokenSecret?: string;
  token?: string;
  verifier?: string;
}

export async function generateOAuthHeader(
  method: string,
  url: string,
  params: OAuthParams,
  extraParams?: Record<string, string>
): Promise<string> {
  const nonce = generateNonce();
  const timestamp = getTimestamp();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: params.consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_version: '1.0',
  };

  if (params.token) {
    oauthParams.oauth_token = params.token;
  }
  if (params.verifier) {
    oauthParams.oauth_verifier = params.verifier;
  }

  // Combine all params for signature base
  const allParams = { ...oauthParams, ...extraParams };
  const sortedKeys = Object.keys(allParams).sort();
  const paramString = sortedKeys
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join('&');

  // Signature base string
  const baseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join('&');

  // Signing key
  const signingKey = `${percentEncode(params.consumerSecret)}&${percentEncode(params.tokenSecret || '')}`;

  // Generate signature
  const signature = await hmacSha1(signingKey, baseString);
  oauthParams.oauth_signature = signature;

  // Build Authorization header
  const headerParams = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(', ');

  return `OAuth ${headerParams}`;
}

// Garmin API endpoints
export const GARMIN_API = {
  REQUEST_TOKEN: 'https://connectapi.garmin.com/oauth-service/oauth/request_token',
  AUTHORIZE: 'https://connect.garmin.com/oauthConfirm',
  ACCESS_TOKEN: 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
  USER_ID: 'https://apis.garmin.com/wellness-api/rest/user/id',
  DEREGISTRATION: 'https://apis.garmin.com/wellness-api/rest/user/registration',
  BACKFILL_DAILIES: 'https://apis.garmin.com/wellness-api/rest/backfill/dailies',
  BACKFILL_ACTIVITIES: 'https://apis.garmin.com/wellness-api/rest/backfill/activities',
  BACKFILL_SLEEP: 'https://apis.garmin.com/wellness-api/rest/backfill/sleep',
  BACKFILL_BODY: 'https://apis.garmin.com/wellness-api/rest/backfill/bodyComps',
  BACKFILL_STRESS: 'https://apis.garmin.com/wellness-api/rest/backfill/stressDetails',
};
