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

    async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
        const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;

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
}
