
import Header from '@/components/header';
import { SignOutButton } from '@clerk/nextjs';
import { auth, getAuth } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react'


type Props = {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {

    const user = auth();

    if (user.userId !== process.env.NEXT_ADMIN_ID) {
        return (
            <div className=' w-full h-screen  flex items-center justify-center bg-red-300'>
                <p className=' items-center justify-center flex flex-col'>
                    You are not authorized to access this page. <span className=''>
                        <SignOutButton />
                    </span>
                </p>
            </div>
        )
    }



    return (
        <>
            <Header />
            <main className='px-3 lg:px-14'>
                {children}
            </main>

        </>
    )
}

export default DashboardLayout