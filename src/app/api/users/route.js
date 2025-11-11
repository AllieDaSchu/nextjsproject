import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

// Reuse PrismaClient across hot reloads / serverless invocations to avoid
// exhausting database connections on Vercel.
const prisma = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
/* let users = [
    {id:1, name:"Ava Lee", major:"CS", year:2, gpa:3.6},
    {id:2, name:"Ben Park", major:"CGT", year:3, gpa:3.2}
]; */


/* GET Method that filters each part of the Users */
export async function GET(request) {
    try {
        const url = new URL(request.url)
        const name = url.searchParams.get('name') || ''
        const major = url.searchParams.get('major') || ''
        const year = url.searchParams.get('year') || ''
        const gpa = url.searchParams.get('gpa') || ''

        const where = {}
        if (name) where.name = { equals: name, mode: 'insensitive' }
        if (major) where.major = { equals: major, mode: 'insensitive' }
        if (year) {
            const yearInt = parseInt(year)
            if (isNaN(yearInt)) {
                return NextResponse.json({ error: 'Invalid year parameter' }, { status: 400 })
            }
            where.year = yearInt
        }
        if (gpa) {
            const gpaFloat = parseFloat(gpa)
            if (isNaN(gpaFloat)) {
                return NextResponse.json({ error: 'Invalid gpa parameter' }, { status: 400 })
            }
            where.gpa = gpaFloat
        }

        const students = await prisma.students.findMany({ where })
        return NextResponse.json(students, { status: 200 })
    } catch (err) {
        console.error('GET /api/users error', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

/* POST Method that allows the user to add a new User */
export async function POST(request) {
    try {
        const body = await request.json()
        const { name, major, year, gpa } = body

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Name is required and must be a string' }, { status: 400 })
        }
        if (!major || typeof major !== 'string') {
            return NextResponse.json({ error: 'Major is required and must be a string' }, { status: 400 })
        }

        const yearInt = parseInt(year)
        if (isNaN(yearInt) || yearInt < 1 || yearInt > 4) {
            return NextResponse.json({ error: 'Year must be an integer between 1 and 4' }, { status: 400 })
        }
        const gpaFloat = parseFloat(gpa)
        if (isNaN(gpaFloat) || gpaFloat < 0 || gpaFloat > 4) {
            return NextResponse.json({ error: 'GPA must be a number between 0 and 4' }, { status: 400 })
        }

        const created = await prisma.students.create({
            data: {
                name,
                major,
                year: yearInt,
                gpa: gpaFloat,
            },
        })

        console.log('Created student:', created)
        return NextResponse.json({ message: 'Post Created!', data: created }, { status: 201 })
    } catch (err) {
        console.error('POST /api/users error', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}