export interface Env {
  FIREBASE_PROJECT_ID: string;
  FIREBASE_API_KEY: string;
  NOTIFICATION_EMAIL: string;
  // If using an email service like Resend or SendGrid:
  // EMAIL_API_KEY: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    try {
      const url = new URL(request.url);

      if (request.method === 'POST' && url.pathname === '/api/contact') {
        const body = await request.json() as any;
        
        // 1. Save to Firestore via REST API
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/enquiries`;
        
        const firestoreDoc = {
          fields: {
            name: { stringValue: body.name || '' },
            email: { stringValue: body.email || '' },
            phone: { stringValue: body.phone || '' },
            sector: { stringValue: body.sector || '' },
            message: { stringValue: body.message || '' },
            status: { stringValue: 'unread' },
            created_at: { stringValue: new Date().toISOString() },
          }
        };

        const firestoreRes = await fetch(firestoreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(firestoreDoc)
        });

        if (!firestoreRes.ok) {
          throw new Error('Failed to save to Firestore');
        }

        // 2. Send Email (MailChannels — free for Cloudflare Workers)
        const emailRequest = new Request('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: env.NOTIFICATION_EMAIL || 'valortrustintegratedserviceslt@gmail.com' }] }],
                from: { email: 'noreply@valortrustgroupofco.name.ng', name: 'ValorTrust Website' },
                subject: `New Enquiry from ${body.name} - ${body.sector}`,
                content: [{ type: 'text/plain', value: `Name: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone}\nSector: ${body.sector}\nMessage: ${body.message}` }]
            })
        });
        
        // Fire and forget email
        ctx.waitUntil(fetch(emailRequest));

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      if (request.method === 'POST' && url.pathname === '/api/analytics') {
        await request.json();
        
        // Forward analytics to Firestore
        // Simplified approach — actual implementation would mirror lib/analytics.ts logic
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: corsHeaders });

    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  },
};
