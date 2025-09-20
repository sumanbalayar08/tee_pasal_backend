import { CopyObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from 'src/config/spaces.config';

export class FileUploadService {
  async uploadToSpaces(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType,
    });

    await s3Client.send(command);

    return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${fileName}`;
  }

  async copyInSpaces(sourceKey: string, destinationKey: string) {
    const command = new CopyObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      CopySource: `${process.env.DO_SPACES_BUCKET}/${sourceKey}`,
      Key: destinationKey,
      ACL: 'public-read',
    });

    await s3Client.send(command);
  }

  async deleteFromSpaces(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
  }
}
