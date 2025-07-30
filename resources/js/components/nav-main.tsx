import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (title: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;
                    const isOpen = openMenus[item.title] || false;
                    
                    if (hasSubItems) {
                        return (
                            <Collapsible
                                key={item.title}
                                open={isOpen}
                                onOpenChange={() => toggleMenu(item.title)}
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton 
                                            tooltip={{ children: item.title }}
                                            className="w-full"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center">
                                                    {item.icon && <item.icon className="mr-2" />}
                                                    <span>{item.title}</span>
                                                </div>
                                                <ChevronRight 
                                                    className={`h-4 w-4 transition-transform duration-200 ${
                                                        isOpen ? 'rotate-90' : ''
                                                    }`} 
                                                />
                                            </div>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton 
                                                        asChild 
                                                        isActive={page.url === subItem.href}
                                                    >
                                                        <Link href={subItem.href || '#'} prefetch>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    // Menu item tanpa sub-items
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                                asChild 
                                isActive={page.url.startsWith(item.href || '#')} 
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href || '#'} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
