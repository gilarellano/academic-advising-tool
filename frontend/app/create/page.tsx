import { UserForm } from "@/app/ui/dashboard/create/create-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Slash } from "lucide-react"

export default async function Page() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
    <div className="flex items-center mb-8">
      <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
                <h1 className="font-semibold text-lg md:text-2xl">&gt;</h1>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/create">
                <h1 className="font-semibold text-lg md:text-2xl">Create</h1>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
    </div>
      <UserForm />
    </main>
  );
}