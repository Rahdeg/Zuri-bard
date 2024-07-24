"use client"

import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import WelcomeMsg from "@/components/welcome-msg";
// import { DataCharts } from "@/components/data-charts";
// import { DataGrid } from "@/components/data-grid";
// import { Button } from "@/components/ui/button";
// import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { UserButton } from "@clerk/nextjs";
import { ImagePlus } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function Home() {
  // const { onOpen } = useNewAccount();

  const handleUploadComplete = (result: any) => {
    console.log('Upload complete:', result);
  };
  return (
    <div className=" max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <WelcomeMsg />
      {/* <DataGrid />
      <DataCharts /> */}
      <p>This is Overview page</p>

      <div>
        <CldUploadWidget onUploadAdded={handleUploadComplete} uploadPreset="ns2woo9y">
          {({ open }) => {
            const onClick = () => {
              open();
            }
            return (
              <Button type="button" disabled={false} variant="secondary" onClick={onClick}>
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload an Image
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
}
