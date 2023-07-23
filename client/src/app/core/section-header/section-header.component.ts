import { BreadcrumbService } from 'xng-breadcrumb';
import { Component } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent {

  constructor(public bcService: BreadcrumbService) {
  
  }

}
