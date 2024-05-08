import { UserForm } from "@/app/ui/dashboard/edit/edit-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { fetchUserById } from "@/lib/data";

export default async function Page({ params }: { params : { id: number}}) {
  const user = await fetchUserById(params.id);
  //console.log(user);

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
              <BreadcrumbLink href="/edit">
                <h1 className="font-semibold text-lg md:text-2xl">Edit</h1>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
    </div>
      <UserForm user={user}/>
    </main>
  );
}