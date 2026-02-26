import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

async function createAdmin() {
  const password = "SunuLamb2024!";
  const passwordHash = await hash(password, 12);

  await sql`
    INSERT INTO admin_users (email, password_hash, name, role)
    VALUES ('admin@sunulamb.sn', ${passwordHash}, 'Super Admin', 'super_admin')
    ON CONFLICT (email) DO NOTHING
  `;

  console.log("Admin user created successfully!");
  console.log("Email: admin@sunulamb.sn");
  console.log("Password: SunuLamb2024!");
}

createAdmin().catch(console.error);
