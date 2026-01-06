import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Discord 웹훅으로 알림 전송 함수
async function sendDiscordNotification(name: string, phone: string, message: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('Discord webhook URL is not configured');
    return;
  }

  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const timestamp = koreaTime.toISOString().replace('T', ' ').substring(0, 19);

  const embed = {
    title: '새로운 상담 문의가 접수되었습니다!',
    color: 0x10B981, // emerald-500 색상
    fields: [
      {
        name: '이름',
        value: name,
        inline: true,
      },
      {
        name: '전화번호',
        value: phone,
        inline: true,
      },
      {
        name: '문의 내용',
        value: message || '(문의 내용 없음)',
        inline: false,
      },
    ],
    footer: {
      text: '로켓콜-분양',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.error('Discord webhook error:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: '이름과 전화번호는 필수입니다.' },
        { status: 400 }
      );
    }

    // Phone number validation (Korean phone format)
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
      return NextResponse.json(
        { error: '올바른 전화번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: name.trim(),
          phone: phone.trim(),
          message: message?.trim() || '',
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '데이터 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // Discord 웹훅으로 알림 전송 (비동기로 처리하여 응답 지연 방지)
    sendDiscordNotification(name.trim(), phone.trim(), message?.trim() || '').catch(err => {
      console.error('Discord notification failed:', err);
    });

    return NextResponse.json({
      success: true,
      message: '상담 신청이 완료되었습니다.',
      inquiry: data,
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
