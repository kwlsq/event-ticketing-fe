import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [res1, res2] = await Promise.all([
      axios.get("https://wilayah.id/api/regencies/31.json"),
      axios.get("https://wilayah.id/api/regencies/32.json"),
    ]);

    const combinedData = [...res1.data.data, ...res2.data.data]
    return NextResponse.json({data: combinedData});
  } catch (error) {
    console.error("Failed to fetch regencies:", error);
    return NextResponse.json({ error: "Failed to fetch regencies" }, { status: 500 });
  }
}
