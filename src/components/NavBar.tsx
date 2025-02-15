import React from 'react'
import { Button } from './ui/button';
import Image from "next/image";

const NavBar = () => {
    return (
        <nav className="mb-8 flex flex-row items-center justify-between border rounded-xl border-[#197686] py-4 px-2">
          <div className="mb-2 md:mb-0">
            <div className="flex">
              <Image
                src="/icons/logo.svg"
                width={24}
                height={24}
                alt="logo"
                className=""
              />
              <Image
                src="/icons/logo2.svg"
                width={44}
                height={23}
                alt="logo"
                className="ml-3"
              />
            </div>
          </div>
          
          <div className="navbar">
            <a href="#" className=" hover:text-white transition-colors">
              Events
            </a>
            <a href="#"  className=" hover:text-white transition-colors">
              My Tickets
            </a>
            <a href="#" className=" hover:text-white transition-colors">
              About Project
            </a>
          </div>
    
          <div className="">
            <Button
              variant="outline"
              className="navbar_logo"
            >
              <p>MY TICKETS</p>
              <Image
                src="/icons/arrow.svg"
                width={16}
                height={0}
                alt="logo"
                className="ml-2"
              />
            </Button>
          </div>
        </nav>
      );
}

export default NavBar
