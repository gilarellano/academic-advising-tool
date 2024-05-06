//render-table.tsx
import React, { useEffect, useState } from "react"
import '../styles/globals.css';   
import { SystemUsers, columns } from "./data-table"
import DataTable from "./page";

async function getData(): Promise<SystemUsers[]> {
    return [
      { userID: 1, name: "Alice Johnson", role: "admin", email: "alice@example.com", hashedPassword: "hashed1" },
      { userID: 2, name: "Bob Smith", role: "student", email: "bob@example.com", hashedPassword: "hashed2" },
      { userID: 3, name: "Cara Stevens", role: "advisor", email: "cara@example.com", hashedPassword: "hashed3" },
      { userID: 4, name: "David Brown", role: "admin", email: "david@example.com", hashedPassword: "hashed4" },
      { userID: 5, name: "Ella White", role: "student", email: "ella@example.com", hashedPassword: "hashed5" },
      { userID: 6, name: "Frank Green", role: "advisor", email: "frank@example.com", hashedPassword: "hashed6" },
      { userID: 7, name: "Grace Hall", role: "admin", email: "grace@example.com", hashedPassword: "hashed7" },
      { userID: 8, name: "Henry Martin", role: "student", email: "henry@example.com", hashedPassword: "hashed8" },
      { userID: 9, name: "Ivy Scott", role: "advisor", email: "ivy@example.com", hashedPassword: "hashed9" },
      { userID: 10, name: "Jack Clark", role: "admin", email: "jack@example.com", hashedPassword: "hashed10" },
      { userID: 11, name: "Kara Young", role: "student", email: "kara@example.com", hashedPassword: "hashed11" },
      { userID: 12, name: "Liam Nelson", role: "advisor", email: "liam@example.com", hashedPassword: "hashed12" },
      { userID: 13, name: "Mia Carter", role: "admin", email: "mia@example.com", hashedPassword: "hashed13" },
      { userID: 14, name: "Noah Torres", role: "student", email: "noah@example.com", hashedPassword: "hashed14" },
      { userID: 15, name: "Olivia Lee", role: "advisor", email: "olivia@example.com", hashedPassword: "hashed15" },
      { userID: 16, name: "Pablo Allen", role: "admin", email: "pablo@example.com", hashedPassword: "hashed16" },
      { userID: 17, name: "Quinn Walker", role: "student", email: "quinn@example.com", hashedPassword: "hashed17" },
      { userID: 18, name: "Rachel King", role: "advisor", email: "rachel@example.com", hashedPassword: "hashed18" },
      { userID: 19, name: "Steve Wright", role: "admin", email: "steve@example.com", hashedPassword: "hashed19" },
      { userID: 20, name: "Tina Moore", role: "student", email: "tina@example.com", hashedPassword: "hashed20" }
    ];
}

function DemoPage() {
    const [data, setData] = useState<SystemUsers[]>([]);
  
    useEffect(() => {
      getData().then(setData).catch(console.error);
    }, []);
  
    return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
    );
  }

export default DemoPage;