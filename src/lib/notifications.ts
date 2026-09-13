/**
 * notifications.ts
 * ─────────────────────────────────────────────────────────────────
 * Multi-channel alert system for ValorTrust Integrated Services Ltd
 * Fires on every visitor form submission:
 *   1. Email alert → leemsdtt.valortrust@gmail.com  (via Web3Forms)
 *   2. WhatsApp push → +2348039535043               (via CallMeBot)
 *
 * Setup:
 *   VITE_WEB3FORMS_ACCESS_KEY  — free key from https://web3forms.com
 *   VITE_CALLMEBOT_APIKEY      — from CallMeBot WhatsApp setup
 * ─────────────────────────────────────────────────────────────────
 */

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const CALLMEBOT_ENDPOINT = 'https://api.callmebot.com/whatsapp.php';

// ── Types ──────────────────────────────────────────────────────────

export interface ContactPayload {
  type: 'contact' | 'newsletter' | 'quote';
  name?: string;
  email?: string;
  phone?: string;
  sector?: string;
  message?: string;
}

export interface NotificationResult {
  email: boolean;
  whatsapp: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────

function buildEmailBody(payload: ContactPayload): string {
  const lines: string[] = [
    `📋 NEW ${payload.type.toUpperCase()} SUBMISSION — ValorTrust`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  ];
  if (payload.name)    lines.push(`👤 Name    : ${payload.name}`);
  if (payload.email)   lines.push(`📧 Email   : ${payload.email}`);
  if (payload.phone)   lines.push(`📞 Phone   : ${payload.phone}`);
  if (payload.sector)  lines.push(`🏢 Sector  : ${payload.sector}`);
  if (payload.message) lines.push(`💬 Message : ${payload.message}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🕐 Time    : ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} (WAT)`);
  lines.push(`🌐 Source  : ValorTrust Official Website`);
  return lines.join('\n');
}

function buildWhatsAppMessage(payload: ContactPayload): string {
  const emoji = payload.type === 'newsletter' ? '📰' : '📩';
  const parts = [`${emoji} *ValorTrust Alert*`];
  parts.push(`*Type:* ${payload.type}`);
  if (payload.name)  parts.push(`*From:* ${payload.name}`);
  if (payload.email) parts.push(`*Email:* ${payload.email}`);
  if (payload.phone) parts.push(`*Phone:* ${payload.phone}`);
  if (payload.sector) parts.push(`*Sector:* ${payload.sector}`);
  if (payload.message) parts.push(`*Msg:* ${payload.message.slice(0, 120)}${payload.message.length > 120 ? '…' : ''}`);
  return parts.join('%0A');
}

// ── Email via Web3Forms ────────────────────────────────────────────

async function sendEmailAlert(payload: ContactPayload): Promise<boolean> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  if (!accessKey) {
    console.warn('[ValorTrust] VITE_WEB3FORMS_ACCESS_KEY not set — email alert skipped.');
    return false;
  }

  const subjectMap: Record<string, string> = {
    contact: '📩 New Contact Enquiry — ValorTrust Website',
    newsletter: '📰 New Newsletter Subscriber — ValorTrust',
    quote: '💼 New Quote Request — ValorTrust Website',
  };

  const formData = new FormData();
  formData.append('access_key', accessKey);
  formData.append('subject', subjectMap[payload.type] ?? 'New Form Submission');
  formData.append('from_name', payload.name ?? 'ValorTrust Website');
  formData.append('replyto', payload.email ?? 'noreply@valortrust.com');
  formData.append('message', buildEmailBody(payload));

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: formData });
    const json = await res.json();
    if (json.success) {
      console.info('[ValorTrust] ✅ Email alert sent via Web3Forms.');
      return true;
    } else {
      console.error('[ValorTrust] Web3Forms error:', json.message);
      return false;
    }
  } catch (err) {
    console.error('[ValorTrust] Email alert failed:', err);
    return false;
  }
}

// ── WhatsApp via CallMeBot ─────────────────────────────────────────

async function sendWhatsAppAlert(payload: ContactPayload): Promise<boolean> {
  const apiKey = import.meta.env.VITE_CALLMEBOT_APIKEY as string | undefined;
  if (!apiKey) {
    console.warn('[ValorTrust] VITE_CALLMEBOT_APIKEY not set — WhatsApp alert skipped.');
    return false;
  }

  const phone = '2348039535043'; // +234 803 953 5043
  const text = buildWhatsAppMessage(payload);
  const url = `${CALLMEBOT_ENDPOINT}?phone=${phone}&text=${text}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      console.info('[ValorTrust] ✅ WhatsApp alert sent via CallMeBot.');
      return true;
    } else {
      console.warn('[ValorTrust] CallMeBot responded:', res.status);
      return false;
    }
  } catch (err) {
    console.error('[ValorTrust] WhatsApp alert failed:', err);
    return false;
  }
}

// ── Main export ────────────────────────────────────────────────────

/**
 * Dispatches multi-channel notification for a visitor form submission.
 * Fires email + WhatsApp simultaneously (non-blocking — won't break UX).
 */
export async function sendNotificationAlert(payload: ContactPayload): Promise<NotificationResult> {
  const [email, whatsapp] = await Promise.allSettled([
    sendEmailAlert(payload),
    sendWhatsAppAlert(payload),
  ]);

  return {
    email: email.status === 'fulfilled' && email.value,
    whatsapp: whatsapp.status === 'fulfilled' && whatsapp.value,
  };
}

// Alias for backwards compatibility
export const sendEmailNotification = sendNotificationAlert;
