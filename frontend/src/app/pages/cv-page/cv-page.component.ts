import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { CvApiService } from '../../api/cv-api.service';
import { Cv } from '../../models/cv.model';

@Component({
  selector: 'app-cv-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv-page.component.html',
  styleUrl: './cv-page.component.scss',
})
export class CvPageComponent {
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly cv = signal<Cv | null>(null);

  readonly profile = computed(() => this.cv()?.profile);

  constructor(private readonly api: CvApiService) {
    this.api.getCv().subscribe({
      next: (cv) => {
        this.cv.set(cv);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load CV');
        this.loading.set(false);
      },
    });
  }
}

