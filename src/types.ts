export type Product = {
    name: string;
    description: string;
    version: string;
    versions: string[];
    action: string;
    info: string;
    sys_info: string[];
    sys_req: string[];
    patch_notes: {
        version: string;
        notes: string;
    }[];
    photos: string[];
};

export type News = {
    title: string;
    date: string;
    content: string;
}