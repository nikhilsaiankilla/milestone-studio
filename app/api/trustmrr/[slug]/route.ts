import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const res = await fetch(`https://trustmrr.com/api/v1/startups/${slug}`, {
    headers: {
      Authorization: `Bearer ${process.env.TRUSTMRR_API_KEY}`,
    },
    next: { revalidate: 60 }, // cache 60s
  });

  if (!res.ok) {
    const status = res.status;
    if (status === 404) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "TrustMRR API error" }, { status: 500 });
  }

  const json = await res.json();

  return NextResponse.json(json);
}
