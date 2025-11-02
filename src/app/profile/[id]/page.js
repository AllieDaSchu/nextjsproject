export default async function({params}) {
    const {id} = await params;

    const response = await fetch(`https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-id.php?id=${id}`, {
        next: {revalidate: 60}
    })
    const data = await response.json()
    const profile = data;

    return (
        profile ? <div className="individualProfileContent">
            <h1>Profile of {profile.name}</h1>
                <p>{profile.title}</p>
                <p>{profile.email}</p>
                <p>{profile.description}</p>
                <img srcSet={profile.image_url} />
        </div> : <div>
            <p>Loading...</p>
        </div>
    )
}