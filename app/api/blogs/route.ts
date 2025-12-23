import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const blog = await request.json();

    const filePath = path.join(process.cwd(), 'data', 'blogs.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const blogs = JSON.parse(fileContents);

    blogs.push(blog);

    await fs.writeFile(filePath, JSON.stringify(blogs, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding blog:', error);
    return NextResponse.json(
      { error: 'Failed to add blog' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'blogs.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const blogs = JSON.parse(fileContents);

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error reading blogs:', error);
    return NextResponse.json(
      { error: 'Failed to read blogs' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { oldTitle, blog } = await request.json();

    if (!oldTitle) {
      return NextResponse.json(
        { error: 'Old title is required' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'blogs.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const blogs = JSON.parse(fileContents);

    const index = blogs.findIndex((b: any) => b.title === oldTitle);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    blogs[index] = blog;

    await fs.writeFile(filePath, JSON.stringify(blogs, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'blogs.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const blogs = JSON.parse(fileContents);

    const filteredBlogs = blogs.filter((b: any) => b.title !== title);

    await fs.writeFile(filePath, JSON.stringify(filteredBlogs, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
