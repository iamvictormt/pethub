'use server';

import { createClient } from '@/lib/supabase/server';

const RATE_LIMIT_MINUTES = 30;

export async function submitFeedback(feedbackType: string, message: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Você precisa estar logado para enviar feedback' };
    }

    // Check rate limiting - user can only submit feedback once every 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000).toISOString();

    const { data: recentFeedback, error: checkError } = await supabase
      .from('feedback')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', thirtyMinutesAgo)
      .limit(1);

    if (checkError) {
      console.error('Error checking rate limit:', checkError);
      return { success: false, error: 'Erro ao verificar limite de envio' };
    }

    if (recentFeedback && recentFeedback.length > 0) {
      return {
        success: false,
        error: `Você já enviou feedback recentemente. Por favor, aguarde ${RATE_LIMIT_MINUTES} minutos entre envios.`,
      };
    }

    // Get user profile for name
    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();

    // Insert feedback into database
    const { error: insertError } = await supabase.from('feedback').insert({
      user_id: user.id,
      user_email: user.email!,
      user_name: profile?.name || user.email?.split('@')[0],
      feedback_type: feedbackType,
      message: message,
    });

    if (insertError) {
      console.error('Error inserting feedback:', insertError);
      return { success: false, error: 'Erro ao salvar feedback' };
    }

    // Send email notification
    try {
      await sendFeedbackEmail({
        userName: profile?.name || user.email?.split('@')[0] || 'Usuário',
        userEmail: user.email!,
        feedbackType,
        message,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the whole operation if email fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    return { success: false, error: 'Erro ao processar feedback' };
  }
}

async function sendFeedbackEmail({
  userName,
  userEmail,
  feedbackType,
  message,
}: {
  userName: string;
  userEmail: string;
  feedbackType: string;
  message: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return;
  }

  const feedbackTypeLabels: Record<string, { label: string; emoji: string; color: string }> = {
    bug: { label: 'Bug Report', emoji: '🐛', color: '#ef4444' },
    suggestion: { label: 'Sugestão', emoji: '💡', color: '#3b82f6' },
    comment: { label: 'Comentário', emoji: '💬', color: '#8b5cf6' },
    other: { label: 'Outro', emoji: '📝', color: '#6b7280' },
  };

  const typeInfo = feedbackTypeLabels[feedbackType] || feedbackTypeLabels.other;
  const currentDate = new Date().toLocaleString('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Feedback - Farejei</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
          <tr>
            <td style="padding: 40px 20px;">
              <!-- Main Container -->
              <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      Farejei
                    </h1>
                    <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                      Novo Feedback Recebido
                    </p>
                  </td>
                </tr>

                <!-- Type Badge -->
                <tr>
                  <td style="padding: 30px 30px 0 30px;">
                    <div style="display: inline-block; background-color: ${
                      typeInfo.color
                    }; color: #ffffff; padding: 10px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                      ${typeInfo.emoji} ${typeInfo.label}
                    </div>
                  </td>
                </tr>

                <!-- User Info Section -->
                <tr>
                  <td style="padding: 20px 30px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 12px; padding: 20px;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <table role="presentation" style="width: 100%;">
                            <tr>
                              <td style="width: 100px; color: #6b7280; font-size: 14px; font-weight: 600;">
                                👤 Usuário:
                              </td>
                              <td style="color: #111827; font-size: 14px; font-weight: 500;">
                                ${userName}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <table role="presentation" style="width: 100%;">
                            <tr>
                              <td style="width: 100px; color: #6b7280; font-size: 14px; font-weight: 600;">
                                📧 Email:
                              </td>
                              <td style="color: #111827; font-size: 14px; font-weight: 500;">
                                <a href="mailto:${userEmail}" style="color: #f97316; text-decoration: none;">
                                  ${userEmail}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <table role="presentation" style="width: 100%;">
                            <tr>
                              <td style="width: 100px; color: #6b7280; font-size: 14px; font-weight: 600;">
                                📅 Data:
                              </td>
                              <td style="color: #111827; font-size: 14px; font-weight: 500;">
                                ${currentDate}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Message Section -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <div style="background-color: #ffffff; border: 2px solid #f97316; border-radius: 12px; padding: 20px;">
                      <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 16px; font-weight: 600;">
                        💬 Mensagem:
                      </h3>
                      <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word;">
${message}
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 13px;">
                      Este email foi enviado automaticamente pelo sistema de feedback do Farejei
                    </p>
                    <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} Farejei - Todos os direitos reservados
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Farejei Feedback <onboarding@resend.dev>',
      to: 'victoorres@icloud.com',
      reply_to: userEmail,
      subject: `[Farejei] ${typeInfo.emoji} ${typeInfo.label} de ${userName}`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error('Failed to send email');
  }

  console.log('Feedback email sent successfully');
}
