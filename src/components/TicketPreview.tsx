'use client'; 
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTicketStore } from "@/store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import html2canvas from "html2canvas";

// Function to generate a unique 12-digit number as a string
function generateUniqueCode() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}
export const TicketPreview = () => {
  const { formData, ticketType, ticketCount, reset } = useTicketStore();
    const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  // const [uniqueBarcode, setUniqueBarcode] = useState("");
  // const [barcodeHeight, setBarcodeHeight] = useState(50);
  // const [barcodeWidth, setBarcodeWidth] = useState(2);

  // useEffect(() => {
  //   // Generate and set a unique barcode value when the component mounts
  //   setUniqueBarcode(generateUniqueCode());
  // }, []);

  // // Responsive barcode height adjustment
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 640) {
  //       setBarcodeHeight(10);
  //       setBarcodeWidth(1);
  //     } else {
  //       setBarcodeHeight(25);
  //       setBarcodeWidth(2);
  //     }
  //   };
  //   window.addEventListener("resize", handleResize);
  //   // Set initial value
  //   handleResize();
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);


 // Download the ticket as an image using html2canvas
 const handleDownload = async () => {
  setIsDownloading(true);
  try {
    const ticketElement = document.getElementById("ticket-preview");
    if (!ticketElement) {
      throw new Error("Ticket element not found");
    }

    // Capture at desktop size with high resolution
    const canvas = await html2canvas(ticketElement, {
      useCORS: true,
      scale: 3, // Triple the resolution for crisp image
      windowWidth: 1200, // Simulate desktop viewport
      windowHeight: 800,
      width: 700, // Match your md:w-[700px] value
      height: 840 // 700px * (6/5 aspect ratio) = 840px
    });

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "ticket.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Download failed. Please try again.");
  }
  setIsDownloading(false);
};

  return (
    <section className="main_card"
    >
      {/* Card Container: Fixed width on md and centered */}
      <Card className="bg-[#041E23] border-[#0E464F] md:w-[700px] mx-auto p-4 md:p-14">
      <CardHeader>
          <CardTitle className="cardtitle1">
            <h1 className="h1">Ready</h1>
            <span className="span1">Step 3/3</span>
          </CardTitle>
          <div className="progress">
            <div className="progress_bar" style={{ width: "100%" }} />
          </div>
        </CardHeader>
<div className="text-center text-[#FFFFFF] space-y-4 p-6">
    <h1 className="font-alatsi text-3xl">Your Ticket is Booked!</h1>
    <p className="text-sm">Check your email for a copy or you can download</p>
</div>

        {/* Ticket Image Container: Takes full width of the Card */}
        <div  id="ticket-preview"
         className="relative w-full aspect-[5/6] bg-cover bg-center rounded-lg shadow-lg overflow-hidden">
          <Image
            src="/icons/ticket.svg"
            alt="Ticket background"
            fill
            className=""
            priority
          />
          
          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-between p-7 md:p-14">
            {/* Event Title & Info */}
            <div className="text-center text-[#FFFFFF]">
              <h2 className="text-2xl md:text-4xl  font-road_rage">
                Techember Fest "25
              </h2>
              <p className="text-[0.625rem] md:text-sm  mt-2">
              📍D4 Rumens Road, Ikoyi, Lagos
                <br />
                📅March 15, 2025 | 7:00 PM
              </p>
            </div>

            {/* User Avatar */}
            <div className="relative mt-1 w-20 h-20 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-[#24A0B5] pb-5">
              <Image
                src={formData.avatar || '/default-avatar.png'}
                alt="User Avatar"
                fill
                className="object"
                sizes="(max-width: 768px) 80px, 96px"
              />
            </div>

            {/* Ticket Details */}
            <div className=" w-[179px] md:w-[300px] md:mb-5 bg-[#08343C] p-4 rounded-md backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-2 ">
    <div >
      <label className="block text-[0.625rem] text-[#ffffff54] mb-1">Name</label>
      <h3 className="text-xs  font-bold text-[#FFFFFF] truncate">
        {formData.fullName}
      </h3>
    </div>
    
    <div>
      <label className="block text-[0.625rem] text-[#ffffff54] mb-1">Email</label>
      <p className="text-xs font-bold text-[#FFFFFF] truncate">
        {formData.email}
      </p>
    </div>
  </div>

  {/* Row 2: Ticket Type & Count */}
  <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#12464E]  ">
    <div>
      <label className="block text-[0.625rem] text-[#ffffff54] mb-1">Ticket Type</label>
      <p className="text-xs text-[0.625rem] text-[#FFFFFF] ">
        {ticketType.toUpperCase()}
      </p>
    </div>
    <div>
      <label className="block text-[0.625rem] text-[#ffffff54] mb-1">Ticket for:</label>
      <p className="text-xs text-[0.625rem] text-[#FFFFFF] ">
        {ticketCount}
      </p>
    </div>
  </div>

  {/* Row 3: Special Request */}
  <div className="mt-4 border-t border-[#12464E]">
    <label className="block text-xs text-[#ffffff54] ">Special Request?</label>
    <p className="text-sm text-white break-words line-clamp-3">
      {formData.request || 'Nil? or the user request comes here'}
    </p>
  </div>
            
            </div>

            {/* Barcode */}
            <div className="text-center pt-9">
            <Image
                src="/icons/BarCode.svg"
                width={200}
                height={10}
                alt="logo"
                className=""
              />
              
            {/* {uniqueBarcode ? (
    <>
      <Barcode
        value={uniqueBarcode}
        background=""
        lineColor="#FFFFFF"
        width={barcodeWidth}
        height={barcodeHeight}
        displayValue={false} // Hides the default barcode text
      />
      <p className=" md:mt-4  text-xs text-[#FFFFFF]">{uniqueBarcode}</p>
    </>
  ) : (
    <p className="text-xs text-[#FFFFFF]">Loading Barcode...</p>
  )} */}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-10 flex flex-col md:flex-row gap-4 w-full max-w-lg mx-auto">
          <Button
            onClick={handleDownload}
            className="w-full bg-[#24A0B5] hover:bg-[#1c7e8f] text-white"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </div>
            ) : (
              "Download Ticket"
            )}
          </Button>

          <Button
            onClick={() => {
              reset();
              router.push("/");
            }}
            className="w-full border border-[#24A0B5] bg-transparent text-[#24A0B5] hover:bg-[#24A0B5]/10"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </section>
  );
};
