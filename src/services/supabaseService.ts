import { supabaseClient } from '../config/supaBaseConfig';

async function handleUploadImage(file: File, bucket: string) {
    if (!file) {
        console.log('NO FILE');
        return;
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error } = await supabaseClient.storage.from(bucket).upload(filePath, file);

    if (error) {
        console.error('Upload error:', error);
        return;
    }

    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
}

async function handleUploadAudio(file: File, bucket: string) {
    console.log('upload audio file:', file);

    if (!file) {
        console.log('NO FILE');
        return;
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error } = await supabaseClient.storage.from(bucket).upload(filePath, file);

    if (error) {
        console.error('Upload error:', error);
        return;
    }

    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
}

export { handleUploadImage, handleUploadAudio };
