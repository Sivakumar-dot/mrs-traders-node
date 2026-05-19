import { Component } from '@angular/core';
import { appConfig } from '../../core/config/app.config';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  protected readonly appConfig = appConfig;
}
