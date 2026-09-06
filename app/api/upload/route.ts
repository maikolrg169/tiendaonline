import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de ImgBB.' }, { status: 500 });
    }

    const imgbbData = new FormData();
    imgbbData.append('image', base64Image);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbData
    });

    const result = await imgbbResponse.json();

    if (result.success) {
      return NextResponse.json({ success: true, url: result.data.url });
    } else {
      console.error('ImgBB Error:', result);
      return NextResponse.json({ error: 'Error al subir a ImgBB.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error interno al subir el archivo.' }, { status: 500 });
  }
}
