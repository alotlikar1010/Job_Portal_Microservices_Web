"use client"
import { Button } from '@/components/ui/button'
import { useAppData } from '@/context/AppContext'
import React from 'react'
import Loading from "@/components/loading";
import Hero from '@/components/hero';
const Home = () => {

  const {loading} = useAppData()

  if (loading) return <Loading/>
  return (
    <div>
   <Hero/>
    </div>
  )
}

export default Home
