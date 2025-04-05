import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css'],
})
export class UpdateEmployeeComponent implements OnInit {
  employeeId: string = '';
  employee: any = {
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
  profilePicture: File | null = null; // Add a property to store the selected file
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchEmployeeDetails();
  }

  fetchEmployeeDetails() {
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (response: any) => {
        const fetchedEmployee = response.data.searchEmployeeByEid;
        this.employee = {
          ...fetchedEmployee,
          date_of_joining: fetchedEmployee.date_of_joining
            ? new Date(fetchedEmployee.date_of_joining).toISOString().split('T')[0]
            : '',
        };
        console.log('Fetched Employee:', this.employee);
      },
      error: (error: any) => {
        this.errorMessage = error.message;
        console.error('Error fetching employee details:', error);
      },
    });
  }

  onFileSelected(event: any) {
    this.profilePicture = event.target.files[0]; // Store the selected file
  }

  updateEmployee() {
    if (this.profilePicture) {
      const formData = new FormData();
      formData.append('profilePicture', this.profilePicture);

      this.employeeService.uploadProfilePicture(formData).subscribe({
        next: (response: any) => {
          console.log('Uploaded Profile Picture URL:', response.filePath); // Debug log
          this.employee.profile_picture = response.filePath; // Set the profile_picture field
          this.updateEmployeeDetails(); // Call the method to update other details
        },
        error: (error: any) => {
          console.error('Error uploading profile picture:', error);
          this.errorMessage = error.message;
        },
      });
    } else {
      this.updateEmployeeDetails(); // Update details if no new picture is uploaded
    }
  }

  updateEmployeeDetails() {
    const updateInput = {
      first_name: this.employee.first_name,
      last_name: this.employee.last_name,
      email: this.employee.email,
      gender: this.employee.gender,
      designation: this.employee.designation,
      salary: this.employee.salary,
      date_of_joining: this.employee.date_of_joining,
      department: this.employee.department,
      profile_picture: this.employee.profile_picture, // Include the profile picture URL
    };

    console.log('Update ID:', this.employeeId); // Log the ID
    console.log('Update Input:', updateInput); // Log the input object

    this.employeeService.updateEmployee(this.employeeId, updateInput).subscribe({
      next: (response: any) => {
        console.log('Update Response:', response); // Log the response
        if (response.data.updateEmployeeByEid) {
          alert('Employee updated successfully');
          this.router.navigate(['/employees']); // Navigate back to the employee list
        } else {
          alert('Update failed: No data returned');
        }
      },
      error: (error: any) => {
        console.error('Error in updateEmployee:', error); // Log the error
        this.errorMessage = error.message;
      },
    });
  }
}
