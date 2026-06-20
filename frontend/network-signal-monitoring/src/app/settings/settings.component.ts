import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent {

  changeTheme(event: any) {

    const selectedTheme = event.target.value;

    // DARK THEME
    if (selectedTheme === 'dark') {

      document.body.classList.add('dark-theme');

    }

    // LIGHT THEME
    else if (selectedTheme === 'light') {

      document.body.classList.remove('dark-theme');

    }

    // SYSTEM DEFAULT
    else {

      document.body.classList.remove('dark-theme');

    }
  }

}