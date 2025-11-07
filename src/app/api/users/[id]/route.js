let users = [
    {id:1, name:"Ava Lee", major:"CS", year:2, gpa:3.6},
    {id:2, name:"Ben Park", major:"CGT", year:3, gpa:3.2}
]

export async function GET(request, {params}) {
    const id = params.id;
    const user = users.find(u => u.id === id)

    if (!user) {
        return Response.json(
            {error: "User not found"},
            {status: 404}
        )
    }
    return Response.json(user, {status: 200})
}

export async function DELETE(request, {params}) {
    const id = params.id;
    const exists = users.some(u => u.id === id);

    if (!exists) {
        return Response.json(
            {error: "User not found"},
            {status: 404}
        );
    }
    users = users.filter(u => u.id !== id);
    return Response.json(
        {message: 'user ${id} deleted'},
        {status: 200}
    );
}

export async function PUT(request, {params}) {
    const index = users.findIndex(u => u.id === params.id);

    if (index === -1) {
        return Response.json(
            {error: "User not found"},
            {status: 404}
        );
    }

    const body = await request.json();
    const updatedUser = { ...users[index] };

    if (body.name) {
        if (typeof body.name !== 'string') {
            return Response.json(
                {error: 'Name must be a string'},
                {status: 400}
            );
        }
        updatedUser.name = body.name;
    }
    if (body.major) {
        if (typeof body.major !== 'string') {
            return Response.json(
                {error: 'Major must be a string'},
                {status: 400}
            );
        }
        updatedUser.major = body.major;
    }
    if (body.year) {
        const yearInt = parseInt(body.year);
        if (isNaN(yearInt) || yearInt < 1 || yearInt > 4) {
            return Response.json(
                {error: 'Year must be an integer between 1 and 4'},
                {status: 400}
            )
        }
        updatedUser.year = yearInt;
    }
    if (body.gpa) {
        const gpaFloat = partseFloat(body.gpa);
        if (isNaN(gpaFloat) || gpaFloat < 0 || gpaFloat > 4) {
            return Response.json(
                {error: 'GPA must be a number between 0 and 4'},
                {status: 400}
            )
        }
        updatedUser.gpa = gpaFloat;
    }

    users[index] = updatedUser;

    return Response.json(
        {message: 'User updated successfully', data: updatedUser},
        {status: 200}
    );
}