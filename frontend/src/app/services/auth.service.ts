import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  login(username: string, password: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            id
            username
            email
            token
          }
        }
      `,
      variables: { username, password },
    });
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            id
            username
            email
            token
          }
        }
      `,
      variables: { username, email, password },
    });
  }

  logout() {
    localStorage.removeItem('token'); // Clear the session token
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Returns true if the token exists
  }
}
