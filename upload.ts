import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configuration
const client = new S3Client({
  endpoint: "https://blr1.digitaloceanspaces.com",
  region: "blr1",
  credentials: {
    accessKeyId: "DO004NAG62F9RN6PPQZU",
    secretAccessKey: "uAMF+/XI8FscjIzQ/F7ORTls/qjnNuBOUgoQ27WQCkA",
  },
});

const bucketName = "teepasal";
const localFolder = "/Users/suman/Downloads/products";

// Recursive function to upload folder
async function uploadFolder(folderPath, prefix = "") {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await uploadFolder(fullPath, `${prefix}${file}/`);
    } else {
      const fileStream = fs.createReadStream(fullPath);
      const key = `${prefix}${file}`;
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fileStream,
          ACL: "public-read", // optional
        })
      );
      console.log(`Uploaded: ${key}`);
    }
  }
}

// Run upload
uploadFolder(localFolder)
  .then(() => console.log("All files uploaded!"))
  .catch(console.error);
