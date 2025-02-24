import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

const news3Client = new S3Client({
    region: 'ru-1',
    endpoint: 'https://s3.timeweb.cloud',
    credentials: {
        accessKeyId: 'W1TXVJB0NPM0A03CQKO7',
        secretAccessKey: 'UwApPCQKSUlZxXCWvQa2kMyyOrCp7ZDcj9vGH82g'
    },
});
export const sendFile = async (buffer, key) => {
    try {
        const upload = new Upload({
            client: news3Client,
            params: {
                Bucket: 'bdc26052-furniture',
                Key: key,
                Body: buffer,
            },
        })

        const data = await upload.done()
        
        if (data.$metadata.httpStatusCode === 200) {
            return data.Location;
        }
    } catch (error) {
        console.log(error);
    }
}



 