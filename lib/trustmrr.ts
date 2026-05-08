export const FetchTrustMrrData = async (slug: string) => {
  const res = await fetch(`https://trustmrr.com/api/v1/startups/${slug}`, {
    headers: {
      Authorization: `Bearer ${process.env.TRUSTMRR_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error("Trust Mrr api error!!");
  }

  const json = await res.json();

  console.log("trust mrr data ", json);
  return json;
};
