import { Bucket } from "sst/node/bucket";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default async function Home() {

  async function upload(data: FormData) {
    "use server";

    const file: File | null = data.get("file") as unknown as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create an S3 client
    const client = new S3Client({ region: "us-east-1" });

    // Set up the command with the necessary parameters
    const command = new PutObjectCommand({
      Bucket: Bucket.public.bucketName,
      Key: file.name,
      Body: buffer,
      ACL: "public-read", // or whatever permissions you want to set
    });

    // Send the command
    await client.send(command);

    console.log(`Uploaded ${file.name} to S3`);

    return { success: true };
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={upload}>
        <input name="file" type="file" accept="image/png, image/jpeg" />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
}
