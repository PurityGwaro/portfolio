import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const project = await request.json();

    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContents);

    projects.push(project);

    await fs.writeFile(filePath, JSON.stringify(projects, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json(
      { error: 'Failed to add project' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContents);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json(
      { error: 'Failed to read projects' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { oldTitle, project } = await request.json();

    if (!oldTitle) {
      return NextResponse.json(
        { error: 'Old title is required' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContents);

    const index = projects.findIndex((p: any) => p.title === oldTitle);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    projects[index] = project;

    await fs.writeFile(filePath, JSON.stringify(projects, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
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

    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContents);

    const filteredProjects = projects.filter((p: any) => p.title !== title);

    await fs.writeFile(filePath, JSON.stringify(filteredProjects, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
