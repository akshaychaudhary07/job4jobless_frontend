import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent {


  constructor(private router: Router) {}

  navigateToFinjobpage() {
    this.router.navigate(['/findjobs']);
  }

}
