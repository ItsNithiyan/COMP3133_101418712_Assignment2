import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // Ensure HttpClient is provided
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, HttpLink } from '@apollo/client/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Ensure HttpClientModule is globally provided
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    provideApollo((): ApolloClientOptions<any> => {
      return {
        cache: new InMemoryCache(),
        link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
      };
    }),
  ],
}).catch((err) => console.error('Error bootstrapping application:', err));
