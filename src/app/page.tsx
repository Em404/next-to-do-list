import Navbar from "@/components/ui/navbar";
import Task from "@/components/ui/task";
import { HydrateClient, api } from "@/trpc/server";

export default async function Home() {
  void api.task.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="mx-auto max-w-4xl h-screen">
        {/* <Navbar /> */}
        <Task />
      </div>
    </HydrateClient>
  );
}
