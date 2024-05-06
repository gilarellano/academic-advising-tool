// import { getUsers } from '@/lib/db';

import { UsersTable } from '../ui/dashboard/users-table';
import { Search } from '../ui/dashboard/search';
import { SystemUsers } from '../ui/dashboard/users-table';
import { useEffect } from 'react';

async function getData(): Promise<SystemUsers[]> {
  return [
    { id: 1, name: "Alice Johnson", role: "admin", email: "alice@example.com", hashedPassword: "hashed1" },
    { id: 2, name: "Bob Smith", role: "student", email: "bob@example.com", hashedPassword: "hashed2" },
    { id: 3, name: "Cara Stevens", role: "advisor", email: "cara@example.com", hashedPassword: "hashed3" },
    { id: 4, name: "David Brown", role: "admin", email: "david@example.com", hashedPassword: "hashed4" },
    { id: 5, name: "Ella White", role: "student", email: "ella@example.com", hashedPassword: "hashed5" },
    { id: 6, name: "Frank Green", role: "advisor", email: "frank@example.com", hashedPassword: "hashed6" },
    { id: 7, name: "Grace Hall", role: "admin", email: "grace@example.com", hashedPassword: "hashed7" },
    { id: 8, name: "Henry Martin", role: "student", email: "henry@example.com", hashedPassword: "hashed8" },
    { id: 9, name: "Ivy Scott", role: "advisor", email: "ivy@example.com", hashedPassword: "hashed9" },
    { id: 10, name: "Jack Clark", role: "admin", email: "jack@example.com", hashedPassword: "hashed10" },
    { id: 11, name: "Kara Young", role: "student", email: "kara@example.com", hashedPassword: "hashed11" },
    { id: 12, name: "Liam Nelson", role: "advisor", email: "liam@example.com", hashedPassword: "hashed12" },
    { id: 13, name: "Mia Carter", role: "admin", email: "mia@example.com", hashedPassword: "hashed13" },
    { id: 14, name: "Noah Torres", role: "student", email: "noah@example.com", hashedPassword: "hashed14" },
    { id: 15, name: "Olivia Lee", role: "advisor", email: "olivia@example.com", hashedPassword: "hashed15" },
    { id: 16, name: "Pablo Allen", role: "admin", email: "pablo@example.com", hashedPassword: "hashed16" },
    { id: 17, name: "Quinn Walker", role: "student", email: "quinn@example.com", hashedPassword: "hashed17" },
    { id: 18, name: "Rachel King", role: "advisor", email: "rachel@example.com", hashedPassword: "hashed18" },
    { id: 19, name: "Steve Wright", role: "admin", email: "steve@example.com", hashedPassword: "hashed19" },
    { id: 20, name: "Tina Moore", role: "student", email: "tina@example.com", hashedPassword: "hashed20" }
  ];
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const users = await getData();

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
      </div>
      <div className="w-full mb-4">
        <Search value={searchParams.q} />
      </div>
        <UsersTable users={users} offset={null}/>
    </main>
  );
}
