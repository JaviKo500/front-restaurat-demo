import { Component } from '@angular/core';
// services
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    band: boolean;

    constructor(public authservice: AuthService) {

    }

}
