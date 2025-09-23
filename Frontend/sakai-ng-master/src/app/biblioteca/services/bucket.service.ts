import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface UploadResponse {
    estadoArchivo: string;
    url: string;
}

@Injectable({ providedIn: 'root' })
export class BucketService {
    constructor(private http: HttpClient) {}

    upload(file: File, modulo: string, idRegistro: string | number, nombreArchivo?: string): Observable<string> {
        const nombre = (nombreArchivo ?? file.name).replace(/\s+/g, '_');
        return from(file.arrayBuffer()).pipe(
            map((buffer) => {
                const bytes = new Uint8Array(buffer);
                let binary = '';
                for (const b of bytes) {
                    binary += String.fromCharCode(b);
                }
                return btoa(binary);
            }),
            switchMap((base64) =>
                this.http.post<UploadResponse>(`${environment.bucketUrl}/almacenarArchivoBucket`, {
                    nombreArchivo: nombre,
                    ruta: `${modulo}/${idRegistro}`,
                    archivo: {
                        base64,
                        contentType: file.type
                    }
                })
            ),
            map((res) => res.url)
        );
    }
}
