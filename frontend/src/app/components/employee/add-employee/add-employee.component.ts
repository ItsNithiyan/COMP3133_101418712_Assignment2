import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {
  employee = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    designation: '',
    salary: null,
    date_of_joining: '',
    department: '',
    profile_picture: '',
  };
  profilePicture: File | null = null;
  errorMessage = '';

  constructor(private employeeService: EmployeeService, private router: Router) {}

  onFileSelected(event: any) {
    this.profilePicture = event.target.files[0]; // Store the selected file
  }

  addEmployee() {
    if (!this.profilePicture) {
      this.errorMessage = 'Please select a profile picture.';
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', this.profilePicture);

    this.employeeService.uploadProfilePicture(formData).subscribe({
      next: (response: any) => {
        console.log('Uploaded Profile Picture URL:', response.filePath); // Debug log
        this.employee.profile_picture = response.filePath; // Set the profile_picture field
        this.employeeService.addEmployee(this.employee).subscribe({
          next: () => {
            alert('Employee added successfully');
            this.router.navigate(['/employees']);
          },
          error: (error: any) => {
            console.error('Error in addEmployee:', error);
            this.errorMessage = error.message;
          },
        });
      },
      error: (error: any) => {
        console.error('Error uploading profile picture:', error);
        this.errorMessage = error.message;
      },
    });
  }
}
