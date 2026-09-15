import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public readonly loading = signal(false);

  private loadingCount = 0;

  show() {
    this.loadingCount++;
    this.loading.set(true);
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loading.set(false);
    }
  }
}
