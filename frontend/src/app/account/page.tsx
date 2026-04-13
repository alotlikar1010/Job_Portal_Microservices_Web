"use client"
import React from 'react'
import {  useAppData } from "@/context/AppContext";
import Loading from '@/components/loading';
const AccountPage = () =>{

    const {isAuth , setUser , loading , setIsAuth,fetchApplications} = useAppData();

    if (loading) return <Loading/>;

    return <div> Account Page  </div>;
}

export default AccountPage