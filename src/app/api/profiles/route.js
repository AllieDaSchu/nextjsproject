import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()
export const runtime = 'nodejs'

export async function POST(request) {
    try {
        const formData = await request.formData()

        const name = formData.get('name')
        const title = formData.get('title')
        const email = formData.get('email')
        const bio = formData.get('bio')
        const img = formData.get('img')

        console.log('Form data received:', { name, title, email, bio, img: img?.name })

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }
        if (!title || title.trim() === '') {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }
        if (!email || email.trim() === '') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }
        if (!bio || bio.trim() === '') {
            return NextResponse.json({ error: 'Bio is required' }, { status: 400 })
        }
        if (!img) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 })
        }
        if (img.size > 1024 * 1024) {
            return NextResponse.json({ error: 'Image size must be less than 1MB' }, { status: 400 })
        }

        const arrayBuffer = await img.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const blob = await put(img.name, buffer, { access: 'public' })
        
        const profile = await prisma.profiles.create({
            data: {
                name: name.trim(),
                title: title.trim(),
                email: email.trim(),
                bio: bio.trim(),
                image_url: blob.url,
            },
        })

        return NextResponse.json({ data: profile }, { status: 201 })
    } catch(error) {
        if (error.code === "P2002") {
            return Response.json({error: "Email already exists in our database"}, {status: 400})
        }
        return Response.json({error: "Something went wrong"}, {status: 500})
    }
}