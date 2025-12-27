import { X } from 'lucide-react';

// filepond
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
);

function PopUp({ checkFile, setCheckNull, checkNull, loading, onClose, files, setFiles, onClick }: any) {
    const handleChooseImage = (fileItems: any) => {
        setCheckNull(false);
        setFiles(fileItems);
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="relative z-10 min-w-96 bg-white rounded-lg p-2">
                <div className="w-full flex justify-end">
                    <X className="mb-2 cursor-pointer" onClick={onClose} />
                </div>

                {loading && (
                    <div className="flex justify-center items-center my-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                )}
                {checkNull && (
                    <div className="flex justify-center items-center my-4">
                        {checkFile === true ? (
                            <h3 className="text-blue-500 text-2xl">Bạn chưa chọn File kìa bạn ơi</h3>
                        ) : (
                            <h3 className="text-blue-500 text-2xl">Bạn chưa chọn hình ảnh kìa bạn ơi</h3>
                        )}
                    </div>
                )}

                <div className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <FilePond
                        files={files}
                        onupdatefiles={handleChooseImage}
                        allowMultiple={false}
                        allowFileSizeValidation
                        maxFileSize="20KB"
                        labelMaxFileSizeExceeded="File quá nặng"
                        labelMaxFileSize="Dung lượng tối đa là {filesize}"
                        acceptedFileTypes={
                            checkFile === true
                                ? [
                                      'application/msword', // .doc
                                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                                      'text/plain', // .txt
                                      'application/vnd.ms-excel', // .xls
                                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                                      'application/pdf', // .pdf
                                      //   'application/zip', // .zip
                                      //   'application/x-rar-compressed', // .rar
                                  ]
                                : ['image/*']
                        }
                        server={null}
                        name="files"
                    />
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={onClick}
                        disabled={loading}
                        className="py-2 px-4 bg-green-400 rounded-xl text-white hover:opacity-85 disabled:bg-slate-500 disabled:opacity-100"
                    >
                        Gửi ảnh
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
