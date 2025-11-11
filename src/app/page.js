import Image from "next/image";
import Navbar from "@/components/Navbar.js"
import styles from "./page.module.css"
import Link from "next/link"
import Card from "@/components/Card.js"
import Columns from "@/components/Columns.jsx"

async function getTitles() {
  const response = await fetch(`https://web.ics.purdue.edu/%7Ezong6/profile-app/get-titles.php`, {
    next: {revalidate: 60}
  })
  const data = await response.json()
  return data ? data.titles : []
}

async function getProfiles(title, search) {
  const response = await fetch(`https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=${title}&name=${search}&limit=1000`, {
    next: {revalidate: 60}
  })
  const data = await response.json();
  return data ? data.profiles : []
}

export default async function Home({searchParams}) {
  const {title = "", search = ""} = await searchParams;
  const [titles, profiles] = await Promise.all([
    getTitles(),
    getProfiles(title, search)

  ])
  console.log(profiles)
  return (
    <div className={styles.page} >
      <main className={styles.main} >
        <h1 className="header">Profiles</h1>
        <form method="GET" action="/">
            <div className="select-filter">
                <div className="dropdownColumn">
                    <label htmlFor="select">Select a Title: </label>
                    <select id="select" className="drop-down" defaultValue={title} name="title">
                        <option value="">All</option>
                        {
                            titles.map(title => <option key={title} defaultValue={title}>{title}</option>)
                        }
                    </select>
                </div>
                <div className="searchColumn">
                    <label htmlFor="search">Search by Name: </label>
                    <input id="search" className="search-bar" defaultValue={search} type="text" placeholder="Enter Name" name="search" />
                    <button type="submit" className="filterBtn">Apply</button>
                    <Link className="filterBtn" href="/">Clear</Link>
                </div>
            </div>
        </form>
        <Columns>
          {profiles?profiles.map((profile) => (
            <Link className="card-link" key={profile.id} href={`/profile/${profile.id}`}>                    
              <Card
                name={profile.name}
                title={profile.title}
                email={profile.email}
                description={profile.bio}
                img={profile.image_url}
              />
            </Link>
          )):<div>Loading...</div>}
        </Columns>
        
      </main>
    </div>
  );
}
