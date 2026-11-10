let client: any = null;

async function getIpfsClient() {
  if (client) return client;
  const { create } = await import("ipfs-http-client");
  const projectId = process.env.IPFS_PROJECT_ID;
  const projectSecret = process.env.IPFS_PROJECT_SECRET;
  const auth =
    projectId && projectSecret
      ? `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString("base64")}`
      : undefined;

  client = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: auth ? { authorization: auth } : undefined
  });
  return client;
}

export async function uploadJson(data: object) {
  const ipfs = await getIpfsClient();
  const result = await ipfs.add(JSON.stringify(data));
  return `ipfs://${result.path}`;
}
