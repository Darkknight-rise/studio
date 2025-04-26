'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, HandHeart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as React from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/register', label: 'Register' },
  { href: '/donor', label: 'Donor Dashboard' },
  { href: '/receiver', label: 'Receiver Dashboard' },
  { href: '/ngo', label: 'NGO Dashboard' },
  { href: '/chat', label: 'Chat' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <HandHeart className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">FoodConnect</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           {/* Add User Profile/Login Button Here if needed */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link
                href="/"
                className="flex items-center space-x-2 mb-6"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                 <HandHeart className="h-6 w-6 text-primary" />
                 <span className="font-bold">FoodConnect</span>
              </Link>
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                   <Link
                     key={item.href}
                     href={item.href}
                     className={cn(
                       'transition-colors hover:text-foreground',
                       pathname === item.href ? 'font-semibold text-foreground' : 'text-foreground/70'
                     )}
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     {item.label}
                   </Link>
                 ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
