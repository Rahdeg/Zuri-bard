import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



export const AvatarIcon = () => {
    return (
        <Avatar className=' size-6'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>

    )
}
