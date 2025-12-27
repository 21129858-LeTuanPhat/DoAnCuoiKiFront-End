import { supabaseClient } from '../config/supaBaseConfig';

async function handleUploadImage(file: File) {
    console.log('HANDLE UPLOAD IMAGE CALLED');
    console.log('FILE TO UPLOAD:', file);
    if (!file) {
        console.log('NO FILE');
        return;
    }

    console.log('STEP 1: start upload');

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error } = await supabaseClient.storage.from('profile_image').upload(filePath, file);

    console.log('STEP 2: after upload');

    if (error) {
        console.error('Upload error:', error);
        return;
    }

    console.log('UPLOAD DATA:', uploadData);

    const { data } = supabaseClient.storage.from('profile_image').getPublicUrl(filePath);

    console.log('STEP 3: public url', data);
    console.log('URL IMAGE >>>', data.publicUrl);

    return data.publicUrl;
}

export { handleUploadImage };
