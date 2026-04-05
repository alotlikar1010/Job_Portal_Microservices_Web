"use client"
import React from 'react'
import {  useAppData } from "@/context/AppContext";
const AccountPage = () =>{

    const {isAuth , setUser , loading , setIsAuth,fetchApplications} = useAppData();


    return <div> Account Page  </div>;
}

export default AccountPage