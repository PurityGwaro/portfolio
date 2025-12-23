import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const tech = await request.json();

    const filePath = path.join(process.cwd(), 'data', 'techstack.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const techStack = JSON.parse(fileContents);

    techStack.push(tech);

    await fs.writeFile(filePath, JSON.stringify(techStack, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding tech:', error);
    return NextResponse.json(
      { error: 'Failed to add tech' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'techstack.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const techStack = JSON.parse(fileContents);

    return NextResponse.json(techStack);
  } catch (error) {
    console.error('Error reading tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to read tech stack' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { oldName, tech } = await request.json();

    if (!oldName) {
      return NextResponse.json(
        { error: 'Old name is required' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'techstack.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const techStack = JSON.parse(fileContents);

    const index = techStack.findIndex((t: any) => t.name === oldName);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Tech not found' },
        { status: 404 }
      );
    }

    techStack[index] = tech;

    await fs.writeFile(filePath, JSON.stringify(techStack, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating tech:', error);
    return NextResponse.json(
      { error: 'Failed to update tech' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'techstack.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const techStack = JSON.parse(fileContents);

    const filteredTechStack = techStack.filter((t: any) => t.name !== name);

    await fs.writeFile(filePath, JSON.stringify(filteredTechStack, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tech:', error);
    return NextResponse.json(
      { error: 'Failed to delete tech' },
      { status: 500 }
    );
  }
}
