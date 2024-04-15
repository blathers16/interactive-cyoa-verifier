import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerifierComponent } from './verifier/verifier.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VerifierComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'interactive-cyoa-verifier';
}
