import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* GET Method that filters each part of the Users */
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    
    const name = searchParams.get('name') || "";
    const major = searchParams.get('major') || "";
    const year = searchParams.get('year') || "";
    const gpa = searchParams.get('gpa') || "";

    const students = await prisma.students.findMany();
    let tempUsers = students;
    if (major) {
        tempUsers = tempUsers.filter((user) => user.major.toLowerCase() === major.toLowerCase())
    }
    if (name) {
        tempUsers = tempUsers.filter((user) => user.name.toLowerCase() === name.toLowerCase())
    }
    if (year) {
        const yearInt = parseInt(year);
        if (isNaN(yearInt)) {
            return Response.json(
                {error: "Invalid year parameter"},
                {status: 400}
            )
        }
        tempUsers = tempUsers.filter((user) => user.year === yearInt)
    }
    if (gpa) {
        const gpaFloat = parseFloat(gpa);
        if (isNaN(gpaFloat)) {
            return Response.json(
                {error: "Invalid gpa parameter"},
                {status: 400}
            )
        }
        tempUsers = tempUsers.filter((user) => user.gpa === gpaFloat)
    }
    
    return Response.json(tempUsers, {status:200})
}

/* POST Method that allows the user to add a new User */
export async function POST(request) {
    const body = await request.json();
    const {name, major, year, gpa} = body;

    if (!body.name || typeof name !== 'string') {
        return Response.json(
            {error:'Name is required and must be a string'},
            {status:400}
        );
    }
    if (!body.major || typeof major != 'string') {
        return Response.json(
            {error:'Major is required and must be a string'},
            {status:400}
        );
    }
    const yearInt = parseInt(body.year);
    if (isNaN(yearInt) || yearInt < 1 || yearInt > 4) {
        return Response.json(
            {error:'Year must be an integer between 1 and 4'},
            {status:400}
        );
    }
    const gpaFloat = parseFloat(body.gpa);
    if (isNaN(gpaFloat) || gpaFloat < 0 || gpaFloat > 4) {
        return Response.json(
            {error:'GPA must be a number between 0 and 4'},
            {status:400}
        );
    }

    const newUser = {id: Date.now(), name, major, yearInt, gpaFloat};
    users.push(newUser);
    console.log('Received:', newUser);
    return Response.json(
        {message:'Post Created!', data: newUser},
        {status: 201}
    )
}