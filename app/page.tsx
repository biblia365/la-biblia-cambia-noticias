import { getHomeData } from '@/lib/home-data'
import HomeClient from './home-client'

export const revalidate = 60

export default async function Home() {
  const data = await getHomeData()
  return <HomeClient {...data} />
}
