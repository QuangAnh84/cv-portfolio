import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CvApiService } from '../../api/cv-api.service';
import { Cv } from '../../models/cv.model';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(CvApiService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly authUsername = signal('admin');
  readonly authPassword = signal('admin');

  readonly form = this.fb.group({
    profile: this.fb.group({
      fullName: this.fb.nonNullable.control('', Validators.required),
      headline: this.fb.nonNullable.control('', Validators.required),
      location: this.fb.nonNullable.control(''),
      email: this.fb.nonNullable.control(''),
      phone: this.fb.nonNullable.control(''),
      avatarUrl: this.fb.nonNullable.control(''),
    }),
    skills: this.fb.array([] as any[]),
    languages: this.fb.array([] as any[]),
    workExperience: this.fb.array([] as any[]),
    education: this.fb.array([] as any[]),
    social: this.fb.group({
      twitter: this.fb.nonNullable.control(''),
      linkedin: this.fb.nonNullable.control(''),
      github: this.fb.nonNullable.control(''),
    }),
  });

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }
  get languages(): FormArray {
    return this.form.get('languages') as FormArray;
  }
  get workExperience(): FormArray {
    return this.form.get('workExperience') as FormArray;
  }
  get education(): FormArray {
    return this.form.get('education') as FormArray;
  }

  constructor() {
    const stored = localStorage.getItem('adminBasicAuth');
    if (stored) {
      const [u, p] = stored.split(':');
      this.authUsername.set(u ?? 'admin');
      this.authPassword.set(p ?? 'admin');
    }

    this.load();
  }

  setAuth() {
    localStorage.setItem('adminBasicAuth', `${this.authUsername()}:${this.authPassword()}`);
    this.message.set('Admin credentials stored in this browser.');
    this.error.set(null);
  }

  clearAuth() {
    localStorage.removeItem('adminBasicAuth');
    this.message.set('Admin credentials removed from this browser.');
    this.error.set(null);
  }

  load() {
    this.loading.set(true);
    this.message.set(null);
    this.error.set(null);
    this.api.getCv().subscribe({
      next: (cv) => {
        this.resetArrays();
        this.form.patchValue(cv);
        cv.skills.forEach((s) => this.skills.push(this.skillGroup(s)));
        cv.languages.forEach((l) => this.languages.push(this.languageGroup(l)));
        cv.workExperience.forEach((w) => this.workExperience.push(this.workGroup(w)));
        cv.education.forEach((e) => this.education.push(this.educationGroup(e)));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load CV');
        this.loading.set(false);
      },
    });
  }

  addSkill() {
    this.skills.push(this.skillGroup({ name: '', percent: 50 }));
  }
  removeSkill(idx: number) {
    this.skills.removeAt(idx);
  }

  addLanguage() {
    this.languages.push(this.languageGroup({ name: '', percent: 50 }));
  }
  removeLanguage(idx: number) {
    this.languages.removeAt(idx);
  }

  addWork() {
    this.workExperience.push(
      this.workGroup({ title: '', company: '', from: '', to: '', details: '' }),
    );
  }
  removeWork(idx: number) {
    this.workExperience.removeAt(idx);
  }

  addEducation() {
    this.education.push(this.educationGroup({ school: '', from: '', to: '', details: '' }));
  }
  removeEducation(idx: number) {
    this.education.removeAt(idx);
  }

  save() {
    this.message.set(null);
    this.error.set(null);

    if (this.form.invalid) {
      this.error.set('Please fix validation errors before saving.');
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() as Cv;
    this.saving.set(true);
    this.api.saveCv(value).subscribe({
      next: () => {
        this.message.set('Saved successfully.');
        this.saving.set(false);
      },
      error: (err) => {
        if (err?.status === 401) {
          this.error.set('Unauthorized. Set correct admin username/password above, then try again.');
        } else {
          this.error.set(err?.message ?? 'Failed to save CV');
        }
        this.saving.set(false);
      },
    });
  }

  private resetArrays() {
    this.skills.clear();
    this.languages.clear();
    this.workExperience.clear();
    this.education.clear();
  }

  private skillGroup(s: { name: string; percent: number }) {
    return this.fb.group({
      name: this.fb.nonNullable.control(s.name, Validators.required),
      percent: this.fb.nonNullable.control(s.percent, [Validators.required, Validators.min(0), Validators.max(100)]),
    });
  }

  private languageGroup(l: { name: string; percent: number }) {
    return this.fb.group({
      name: this.fb.nonNullable.control(l.name, Validators.required),
      percent: this.fb.nonNullable.control(l.percent, [Validators.required, Validators.min(0), Validators.max(100)]),
    });
  }

  private workGroup(w: Cv['workExperience'][number]) {
    return this.fb.group({
      title: this.fb.nonNullable.control(w.title, Validators.required),
      company: this.fb.nonNullable.control(w.company, Validators.required),
      from: this.fb.nonNullable.control(w.from, Validators.required),
      to: this.fb.nonNullable.control(w.to, Validators.required),
      details: this.fb.nonNullable.control(w.details),
    });
  }

  private educationGroup(e: Cv['education'][number]) {
    return this.fb.group({
      school: this.fb.nonNullable.control(e.school, Validators.required),
      from: this.fb.nonNullable.control(e.from, Validators.required),
      to: this.fb.nonNullable.control(e.to),
      details: this.fb.nonNullable.control(e.details),
    });
  }
}

