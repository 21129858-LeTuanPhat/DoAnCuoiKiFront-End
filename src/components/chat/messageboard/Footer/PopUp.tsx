import { X } from 'lucide-react';

// filepond
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { useState } from 'react';

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation, FilePondPluginFileValidateSize);

function PopUp({ onClose, files, setFiles }: any) {
    return (
        <div className="fixed flex top-0 bottom-0 left-0 right-0">
            <div className="m-auto relative z-10">
                <div className="min-w-96 bg-white rounded-lg">
                    <div className="p-2">
                        <div className="w-full flex flex-row-reverse">
                            <X className="mb-2 cursor-pointer" onClick={onClose} />
                        </div>
                        <div>
                            <FilePond
                                files={files}
                                onupdatefiles={setFiles}
                                allowMultiple={false}
                                allowFileSizeValidation
                                maxFileSize="20KB"
                                labelMaxFileSizeExceeded="File quá nặng"
                                labelMaxFileSize="Dung lượng tối đa là {filesize}"
                                server={null}
                                name="files"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
