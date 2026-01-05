import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
    private supabase: SupabaseClient;
    private bucket: string;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_KEY!,
        );
        this.bucket = process.env.SUPABASE_BUCKET || 'uploads';
    }

    async uploadFile(file: Express.Multer.File, folder: string = ''): Promise<{ url: string }> {
        const sanitizedFolder = folder ? `${folder.replace(/^\/+|\/+$/g, '')}/` : '';
        const fileName = `${sanitizedFolder}${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;

        const { data, error } = await this.supabase.storage
            .from(this.bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new InternalServerErrorException(`Upload failed: ${error.message}`);
        }

        const { data: publicData } = this.supabase.storage
            .from(this.bucket)
            .getPublicUrl(fileName);

        return { url: publicData.publicUrl };
    }

    async deleteFiles(urls: string[]): Promise<void> {
        if (!urls || urls.length === 0) return;

        // Extract paths from URLs
        // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/path/to/file
        const paths = urls.map(url => {
            const parts = url.split(`/storage/v1/object/public/${this.bucket}/`);
            return parts.length > 1 ? parts[1] : null;
        }).filter(path => path !== null) as string[];

        if (paths.length === 0) return;

        const { error } = await this.supabase.storage
            .from(this.bucket)
            .remove(paths);

        if (error) {
            console.error('Failed to delete files:', error);
            // We log but don't throw to avoid blocking the main delete operation
        }
    }
}
