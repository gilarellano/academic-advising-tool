// users-table.tsx
'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/components/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import Link from 'next/link';
import { MoreHorizontal } from "lucide-react";
import { Button } from '@/components/button';
import { SystemUser } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { deleteUser } from '@/lib/action';

export function UsersTable({
  users,
  offset
}: {
  users: SystemUser[];
  offset: number | null;
}) {
  const router = useRouter();

  function onClick() {
    router.replace(`/?offset=${offset}`);
  }

  return (
    <>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">User ID</TableHead>
              <TableHead className="max-w-[150px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Hashed Password</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow key={user.userID} user={user} />
            ))}
          </TableBody>
        </Table>
      </form>
      {offset !== null && (
        <Button
          className="mt-4 w-40"
          variant="secondary"
          onClick={() => onClick()}
        >
          Next Page
        </Button>
      )}
    </>
  );
}

function UserRow({ user }: { user: SystemUser }) {
  const userId = user.userID;
  const deleteUserWithId = deleteUser.bind(null, userId);

  return (
    <TableRow key={user.userID}>

      <TableCell className="font-medium">{user.userID}</TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
      <TableCell>{user.password}</TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/${user.userID}/edit`} passHref>
              <DropdownMenuItem onClick={() => console.log(`Edit ${user.userID}`)}>
                  Edit User
              </DropdownMenuItem>
           </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => deleteUserWithId()}>
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
