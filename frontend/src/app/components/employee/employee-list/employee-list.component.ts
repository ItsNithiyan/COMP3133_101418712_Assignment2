import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router'; // Import RouterModule
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add required modules
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  searchQuery = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (response: any) => {
        console.log('Fetched Employees:', response.data.getAllEmployees); // Debug log
        this.employees = response.data.getAllEmployees;
      },
      error: (error: any) => {
        console.error('Error fetching employees:', error);
      },
    });
  }

  searchEmployees() {
    if (!this.searchQuery.trim()) {
      this.fetchEmployees();
      return;
    }

    this.employeeService.searchEmployees(this.searchQuery).subscribe({
      next: (response: any) => {
        console.log('Search Results:', response.data.searchEmployeeByDesignationOrDepartment); // Debug log
        this.employees = response.data.searchEmployeeByDesignationOrDepartment;
      },
      error: (error: any) => {
        console.error('Error searching employees:', error);
      },
    });
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.fetchEmployees();
        },
        error: (error: any) => {
          console.error('Error deleting employee:', error);
        },
      });
    }
  }

  refreshList() {
    this.fetchEmployees();
  }
}
