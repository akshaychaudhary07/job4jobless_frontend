import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {

  constructor() { }
  setCanonicalURL(url?: string) {
    const canURL = url === undefined ? window.location.href : url;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canURL);
  }
}
