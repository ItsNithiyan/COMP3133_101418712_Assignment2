import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

  getAllEmployees(): Observable<any> {
    return this.apollo.query({
      query: gql`
        query {
          getAllEmployees {
            id
            first_name
            last_name
            email
            designation
            department
            profile_picture
          }
        }
      `,
    }).pipe(
      catchError((error: any) => {
        console.error('Error in getAllEmployees:', error); // Debug log
        throw error;
      })
    );
  }

  addEmployee(input: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee($input: EmployeeInput!) {
          addEmployee(input: $input) {
            id
            first_name
            last_name
            email
            designation
            department
            profile_picture
          }
        }
      `,
      variables: { input },
    }).pipe(
      catchError((error: any) => {
        console.error('Error in addEmployee:', error);
        throw error;
      })
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployeeByEid(eid: $id)
        }
      `,
      variables: { id },
    }).pipe(
      catchError((error: any) => {
        console.error('Error in deleteEmployee:', error);
        throw error;
      })
    );
  }

  getEmployeeById(id: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query GetEmployeeById($id: ID!) {
          searchEmployeeByEid(eid: $id) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            profile_picture
          }
        }
      `,
      variables: { id },
    }).pipe(
      catchError((error: any) => {
        console.error('Error in getEmployeeById:', error);
        throw error;
      })
    );
  }

  updateEmployee(id: string, input: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
          updateEmployeeByEid(eid: $id, input: $input) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            date_of_joining
            department
            profile_picture
            updated_at
          }
        }
      `,
      variables: { id, input },
      refetchQueries: [
        {
          query: gql`
            query {
              getAllEmployees {
                id
                first_name
                last_name
                email
                designation
                department
                profile_picture
              }
            }
          `,
        },
      ],
    }).pipe(
      catchError((error: any) => {
        console.error('Error in updateEmployee:', error);
        throw error;
      })
    );
  }

  searchEmployees(query: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query SearchEmployees($query: String) {
          searchEmployeeByDesignationOrDepartment(designation: $query, department: $query) {
            id
            first_name
            last_name
            email
            designation
            department
            profile_picture
          }
        }
      `,
      variables: { query },
    }).pipe(
      catchError((error: any) => {
        console.error('Error in searchEmployees:', error);
        throw error;
      })
    );
  }

  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:4000/upload', formData).pipe(
      catchError((error: any) => {
        console.error('Error in uploadProfilePicture:', error);
        throw error;
      })
    );
  }
}

