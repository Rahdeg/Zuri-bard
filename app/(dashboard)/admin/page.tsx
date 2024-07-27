

import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import WelcomeMsg from "@/components/welcome-msg";
// import { DataCharts } from "@/components/data-charts";
// import { DataGrid } from "@/components/data-grid";
// import { Button } from "@/components/ui/button";
// import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ImagePlus } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function Home() {
  // const { onOpen } = useNewAccount();

  return (
    <div className=" max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <WelcomeMsg />
      {/* <DataGrid />
      <DataCharts /> */}
      <p>This is Overview page</p>


    </div>
  );
}
