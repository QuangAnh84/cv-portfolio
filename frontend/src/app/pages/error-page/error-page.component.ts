import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

type ErrorNavState = {
  status?: number;
  message?: string;
  from?: string;
  url?: string;
};

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
  private readonly router = inject(Router);

  private readonly state = (history.state ?? {}) as ErrorNavState;

  readonly status = computed(() => this.state.status);
  readonly message = computed(() => this.state.message ?? 'Something went wrong while contacting the server.');
  readonly from = computed(() => this.state.from ?? '/cv');
  readonly url = computed(() => this.state.url);

  goBack() {
    void this.router.navigateByUrl(this.from());
  }

  reload() {
    window.location.reload();
  }
}

