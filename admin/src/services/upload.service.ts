import { apiClient } from "@/lib/api-client";

interface UploadResponse {
    url: string;
}

export const uploadService = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.url;
    },
};
