import { NextRequest, NextResponse } from 'next/server';

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

    // Discord 웹훅으로 직접 알림 전송
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('Discord webhook URL is not configured');
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const embed = {
      title: '🔔 새로운 상담 문의가 접수되었습니다!',
      color: 0x10B981,
      fields: [
        {
          name: '이름',
          value: name.trim(),
          inline: true,
        },
        {
          name: '전화번호',
          value: phone.trim(),
          inline: true,
        },
        {
          name: '문의 내용',
          value: message?.trim() || '(문의 내용 없음)',
          inline: false,
        },
      ],
      footer: {
        text: '로켓콜-분양',
      },
      timestamp: new Date().toISOString(),
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordResponse.ok) {
      console.error('Discord webhook error:', discordResponse.status, await discordResponse.text());
      return NextResponse.json(
        { error: '알림 전송 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '상담 신청이 완료되었습니다.',
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
