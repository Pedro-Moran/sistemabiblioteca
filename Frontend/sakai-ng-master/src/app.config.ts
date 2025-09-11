import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

import { HttpClientModule } from '@angular/common/http';
import { MsalModule, MsalService } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

import { authInterceptor } from './app/interceptors/auth.interceptor';

const AuraRose = definePreset(Aura, {
    semantic: {
        primary: (Aura as any).primitive.rose
    }
});

// Instancia de MSAL
const msalInstance = new PublicClientApplication({
    auth: {
        clientId: '5137464e-be4f-471b-9987-f36347d1bb31', // Reemplaza con tu clientId
        authority: 'https://login.microsoftonline.com/ef992dc6-3ef9-4793-9018-23fb02a7fa9a', // Reemplaza con tu tenant
        redirectUri: 'http://localhost:4200' // URL de tu app
    }
});

// Función que inicializa MSAL y se usará en APP_INITIALIZER
export function initializeMsal(msalService: MsalService): () => Promise<void> {
    return () => msalService.instance.initialize();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        importProvidersFrom(HttpClientModule),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: AuraRose, options: { darkModeSelector: '.app-dark' } } }),

        importProvidersFrom(
            MsalModule.forRoot(
                msalInstance,
                {
                    interactionType: InteractionType.Popup,
                    authRequest: {
                        scopes: ['user.read']
                    }
                },
                {
                    interactionType: InteractionType.Popup,

                    protectedResourceMap: new Map([['http://localhost:8080/auth', ['api://5137464e-be4f-471b-9987-f36347d1bb31/.default']]])
                }
            )
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeMsal,
            deps: [MsalService],
            multi: true
        }
    ]
};
