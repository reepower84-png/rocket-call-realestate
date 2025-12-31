import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '데이터를 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ inquiries: data });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID와 상태값이 필요합니다.' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'contacted', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태값입니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '해당 문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: data,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: '업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '해당 문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '삭제되었습니다.',
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: '삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
