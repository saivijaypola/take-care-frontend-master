
import http from "../handler/api-common";


const upload = async (file, body, user, onUploadProgress) => {
  
    let formData = new FormData();
    formData.append("file", file);
  //  formData.append('metaInfo',JSON.stringify(body))
    
    return http.post(`/upload/bills/${body.providerId}/${body.orderId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": await user.getIdToken()
        },
        onUploadProgress,
    });
};

const getFiles = () => {
    return http.get("/files");
};

export default {
    upload,
    getFiles,
};