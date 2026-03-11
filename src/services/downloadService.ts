/**
 * Download Service
 * 
 * A production-ready utility for handling file downloads in the browser.
 * Supports various file types, progress tracking simulation, and proper memory management.
 */

export interface DownloadOptions {
    filename: string;
    contentType?: string;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
}

/**
 * Triggers a browser download for a given Blob or URL.
 */
export const downloadFile = async (
    data: Blob | string | ArrayBuffer,
    options: DownloadOptions
): Promise<void> => {
    const { filename, contentType = 'application/octet-stream', onProgress, onComplete, onError } = options;

    try {
        let blob: Blob;

        if (data instanceof Blob) {
            blob = data;
        } else if (data instanceof ArrayBuffer) {
            blob = new Blob([data], { type: contentType });
        } else if (typeof data === 'string') {
            // If it's a URL, fetch it
            if (data.startsWith('http') || data.startsWith('/')) {
                const response = await fetch(data);
                if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
                
                // Progress tracking for fetch
                const contentLength = response.headers.get('content-length');
                const total = contentLength ? parseInt(contentLength, 10) : 0;
                let loaded = 0;

                const reader = response.body?.getReader();
                if (!reader) throw new Error('ReadableStream not supported');

                const chunks: Uint8Array[] = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    chunks.push(value);
                    loaded += value.length;
                    
                    if (total > 0 && onProgress) {
                        onProgress(Math.round((loaded / total) * 100));
                    }
                }
                blob = new Blob(chunks, { type: contentType });
            } else {
                // Assume it's raw text content
                blob = new Blob([data], { type: contentType });
            }
        } else {
            throw new Error('Unsupported data type for download');
        }

        // Create object URL
        const url = window.URL.createObjectURL(blob);
        
        // Create temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            if (onComplete) onComplete();
        }, 100);

    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (onError) onError(err);
        console.error('Download failed:', err);
        throw err;
    }
};

/**
 * Generates and downloads a CSV file from an array of objects.
 */
export const downloadCSV = <T extends Record<string, any>>(
    data: T[],
    filename: string,
    options?: Omit<DownloadOptions, 'filename' | 'contentType'>
): void => {
    if (data.length === 0) return;

    try {
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','), // Header row
            ...data.map(row => 
                headers.map(fieldName => {
                    const value = row[fieldName];
                    const escaped = ('' + value).replace(/"/g, '""');
                    return `"${escaped}"`;
                }).join(',')
            )
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        downloadFile(blob, {
            filename: filename.endsWith('.csv') ? filename : `${filename}.csv`,
            contentType: 'text/csv',
            ...options
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (options?.onError) options.onError(err);
        throw err;
    }
};

/**
 * Example usage:
 * 
 * import { downloadCSV } from './services/downloadService';
 * 
 * const transactions = [
 *   { id: '1', amount: 100, status: 'captured' },
 *   { id: '2', amount: 200, status: 'failed' }
 * ];
 * 
 * downloadCSV(transactions, 'report.csv', {
 *   onComplete: () => console.log('Download finished!'),
 *   onError: (err) => alert(`Error: ${err.message}`)
 * });
 */
