import {PrismaClient} from '@prisma/client'
import {put, del} from "@vercel/blob"

const prisma = new PrismaClient();
export const runtime = 'nodejs'

export async function PUT(request, {params}) {
    try {
        const {id} = await params
        const profileId = parseInt(id)
        if (isNaN(profileId)) {
            return Response.json({error: "Invalid profileID"}, {status: 400})
        } 
        const formData = await request.formData()
        
            const name = formData.get('name')
            const title = formData.get('title')
            const email = formData.get('email')
            const bio = formData.get('bio')
            const img = formData.get('img')
            let existingImgURL = formData.get("existingImgURL")
    
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
            if (!img && !existingImgURL) {
                return NextResponse.json({ error: 'Image is required' }, { status: 400 })
            }
            let finalImgURL = existingImgURL
            if (img && typeof img === "object" && img.size > 0) {
                if (img.size > 1024 * 1024) {
                    return NextResponse.json({ error: 'Image size must be less than 1MB' }, { status: 400 })
                }
            
            
                const arrayBuffer = await img.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)
                const blob = await put(img.name, buffer, { access: 'public' })
                finalImgURL = blob.url;
            }
        const update = await prisma.profiles.update( {
            where: {id: profileId},
            data: {
                name: name.trim(),
                title: title.trim(),
                email: email.trim(),
                bio: bio.trim(),
                image_url: finalImgURL,
            }
        })
        return Response.json({data: update}, {status: 201})
        
    } catch(error) {
        if (error.code === "P2002") {
            return Response.json({error: "Profile not found"}, {status: 404})
        } if (error.code === 'P2025') {
            return Response.json({error: "Profile not found"}, {status: 404})
        }
        return Response.json({error: "Failed to update profile"}, {status: 500})
    }    
}

export async function DELETE(request, {params}) {
    console.log("Test")
    try {
        
        const {id} = params;
        const profileId = parseInt(id)
        if (isNaN(profileId)) {
            return Response.json({error: "Invalid profile"}, {status: 400})
        }
        const profile = await prisma.profiles.findUnique({
            where: {id: profileId}
        })

        if (profile.image_url) {
            const urlParts = profile.image_url.split("/")
            const fileKey = urlParts[urlParts.length - 1]

            try {
                await del(fileKey)
                
            } catch (error) {
                return Response.json({error: "Blob Delete Failed"}, {status: 404})
            }
        }

        const deleted = await prisma.profiles.delete({
            where: {id: profileId}
        })
        return Response.json({data: deleted}, {status: 200})
    } catch (error) {
        if (error.code === 'P2025') {
            return Response.json({error: "Profile not found"}, {status: 404})
        }
        return Response.json({error: "Failed to delete profile"}, {status: 400})
    }
}