// /dashboard page.tsx
import { UsersTable } from '../ui/dashboard/users-table';
import { CreateUser } from '../ui/dashboard/button'
import { Search } from '../ui/dashboard/search';
import { fetchUsers } from '@/lib/data';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Slash } from "lucide-react"


export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = parseInt(searchParams.offset, 10) || 0;
  const { users, offset: newOffset } = await fetchUsers(1, 20);
  
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Search value={searchParams.q} />
        <CreateUser />
      </div>
        <UsersTable users={users} offset={null}/>
    </main>
  );
}
