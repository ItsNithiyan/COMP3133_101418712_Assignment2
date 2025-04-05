import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for Angular directives
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule], // Ensure CommonModule is included
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId: string = '';
  employee: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchEmployeeDetails();
  }

  fetchEmployeeDetails() {
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (response: any) => {
        console.log('Fetched Employee Details:', response.data.searchEmployeeByEid); // Debug log
        this.employee = response.data.searchEmployeeByEid;
      },
      error: (error: any) => {
        console.error('Error fetching employee details:', error);
      },
    });
  }
}
