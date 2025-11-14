import Image from "next/image";
import Navbar from "@/components/Navbar.js"
import styles from "./page.module.css"
import Link from "next/link"
import Card from "@/components/Card.js"
import Columns from "@/components/Columns.jsx"
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient()

export default async function Home({searchParams}) {
  const {title = "", search = ""} = await searchParams;
  const profiles = await prisma.profiles.findMany({
    where: {
      title: title ? { equals: title} : undefined,
      name: search ? { contains: search, mode: "insensitive" } : undefined,
    },
    orderBy: { id: "desc"},
  });

  const allTitles = await prisma.profiles.findMany({
    distinct: ['title'],
    select: { title: true },
    orderBy: {title: "asc"},
  });

  const titles = allTitles.map((t) => t.title);

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
                bio={profile.bio}
                img={profile.image_url}
              />
            </Link>
          )):<div>Loading...</div>}
        </Columns>
        
      </main>
    </div>
  );
}
