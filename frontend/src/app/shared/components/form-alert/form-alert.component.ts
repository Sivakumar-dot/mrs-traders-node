import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-alert',
  templateUrl: './form-alert.component.html',
  styleUrls: ['./form-alert.component.css']
})
export class FormAlertComponent {
  @Input() type: 'success' | 'error' = 'success';
  @Input() message = '';
}
