import * as fs from "node:fs";

export const readFileString = (path: string): string => {
    return fs.readFileSync(path, { encoding:'utf-8' });
}

export const readFileBytes = (path: string): Buffer<ArrayBuffer> => {
    return fs.readFileSync(path);
}

export const exists = (path: string): boolean => {
    return fs.existsSync(path);
}