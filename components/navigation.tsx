"use client"
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useMedia } from 'react-use'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import NavButton from './nav-button'


const routes = [
    {
        href: "/admin",
        label: "Overview"
    },
    {
        href: "/admin/categories",
        label: "Categories"
    },
    {
        href: "/admin/sizes",
        label: "Sizes"
    },
    {
        href: "/admin/colors",
        label: "Colors"
    },
    {
        href: "/admin/products",
        label: "Products"
    },
    {
        href: "/admin/orders",
        label: "Orders"
    },
    {
        href: "/admin/expensis",
        label: "Expensis"
    },
    {
        href: "/admin/settings",
        label: "Settings"
    },

]

const Navigation = () => {

    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useMedia("(max-width: 1024px)", false);

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    }

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button variant="outline" size="sm" className=' font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition'>
                        <Menu className=' size-4' />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className='px-2'>
                    <nav className='flex flex-col gap-y-2 pt-6'>
                        {
                            routes.map((route) => (
                                <Button key={route.href}
                                    variant={route.href === pathname ? "secondary" : "ghost"}
                                    onClick={() => onClick(route.href)}
                                    className=' w-full justify-start'
                                >
                                    {route.label}
                                </Button>
                            ))
                        }
                    </nav>
                </SheetContent>
            </Sheet>
        )
    }


    return (
        <nav className=' hidden lg:flex items-center gap-x-2 overflow-x-auto'>
            {
                routes.map((route) => (
                    <NavButton
                        key={route.href}
                        href={route.href}
                        label={route.label}
                        active={pathname === route.href}
                    />
                ))
            }

        </nav>
    )
}

export default Navigation