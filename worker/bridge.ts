/**
 * XETA NEXT BRIDGE & WEBHOOK PROTOCOL
 * Real-time event broadcasting and cryptographic verification.
 */

import { NeuralAI } from './ai';
import { SovereignStore } from './store';
import { Env } from './index';

export class BridgeManager {
    static async verifyHmac(payload: string, signature: string, secret: string): Promise<boolean> {
        if (!signature || !secret) return false;
        try {
            const encoder = new TextEncoder();
            const keyData = encoder.encode(secret);
            const data = encoder.encode(payload);

            const key = await crypto.subtle.importKey(
                'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
            );

            // Shopify/Standard hex signature
            const sigBytes = signature.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16));
            if (!sigBytes) return false;
            const sigData = new Uint8Array(sigBytes);
            return await crypto.subtle.verify('HMAC', key, sigData, data);
        } catch (e) {
            console.error('HMAC Verification Error:', e);
            return false;
        }
    }

    static async logEvent(env: Env, log: any) {
        const logs = JSON.parse(await env.BRIDGE_STORE.get('logs') || '[]');
        logs.unshift(log);
        if (logs.length > 100) logs.pop();
        await env.BRIDGE_STORE.put('logs', JSON.stringify(logs));

        // BROADCAST to all active WebSocket connections
        const bc = new BroadcastChannel('xeta-bridge-stream');
        bc.postMessage({ type: 'transaction', ...log.payload, bridgeId: log.bridgeId });
        bc.close();
    }

    static async getConfigs(env: Env): Promise<any[]> {
        return JSON.parse(await env.BRIDGE_STORE.get('configs') || '[]');
    }

    static async saveConfig(env: Env, config: any) {
        const configs = await this.getConfigs(env);
        const idx = configs.findIndex((c: any) => c.id === config.id);
        if (idx !== -1) configs[idx] = config;
        else configs.push(config);
        await env.BRIDGE_STORE.put('configs', JSON.stringify(configs));
    }

    static async processShopifyWebhook(env: Env, payload: any, signature: string, aiKey: string) {
        const store = new SovereignStore(env);
        const configs = await this.getConfigs(env);
        const shopifyBridge = configs.find((c: any) => c.platform === 'Shopify');

        // 1. Strict Verification (if secret is configured)
        if (shopifyBridge?.secretKey && signature) {
            const isValid = await this.verifyHmac(JSON.stringify(payload), signature, shopifyBridge.secretKey);
            if (!isValid) throw new Error('INVALID_HMAC_SIGNATURE');
        }

        // 2. Continuous AI Audit (with Failsafe)
        let auditResult: { risk: 'Low' | 'Medium' | 'High', reason: string };
        try {
            auditResult = await NeuralAI.assessRisk(aiKey, payload);
        } catch (e) {
            console.warn('⚠️ Neural Risk Audit Failed (Service/Key Error):', e);
            auditResult = { risk: 'Medium', reason: 'Neural link interrupted - using defensive baseline.' };
        }

        // 3. Persistent Logging & Live Broadcast
        const logId = `L-${Math.random().toString(36).substring(7).toUpperCase()}`;
        await this.logEvent(env, {
            id: logId,
            bridgeId: shopifyBridge?.id || 'EXTERNAL-SHOPIFY',
            type: 'INBOUND',
            payload: {
                id: payload.id || payload.order_id,
                amount: payload.total_price || payload.amount || 0,
                method: 'Shopify',
                risk: auditResult.risk,
                timestamp: new Date().toISOString()
            },
            status: 200
        });

        // 4. Ledger Update (If Payment Success)
        if (payload.financial_status === 'paid' || !payload.financial_status) {
            await store.saveOrder({
                id: `TX-${payload.id || Math.random().toString(36).substring(7)}`,
                amount: parseFloat(payload.total_price || payload.amount || 0),
                currency: payload.currency || 'USD',
                method: 'Shopify-Bridge',
                fee: 0,
                processingTime: 0.1,
                fraudRisk: auditResult.risk === 'High' ? 1 : 0,
                status: 'Completed',
                timestamp: new Date().toISOString()
            });
            await store.updateUsage(1);
        }

        return { status: 'LIVE_ACK', logId };
    }
}

export function handleBridgeWebSocket(request: Request) {
    // @ts-ignore
    const [client, server] = new WebSocketPair();
    server.accept();

    const bc = new BroadcastChannel('xeta-bridge-stream');

    bc.onmessage = (event) => {
        // Send real-world events from the BroadcastChannel to the WebSocket client
        server.send(JSON.stringify(event.data));
    };

    server.addEventListener('close', () => {
        bc.close();
    });

    return new Response(null, { status: 101, webSocket: client });
}
