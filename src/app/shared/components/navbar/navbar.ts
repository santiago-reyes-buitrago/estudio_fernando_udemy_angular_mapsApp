import {Component, inject} from '@angular/core';
import {routes} from '../../../app.routes';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter, map} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  router = inject(Router)
  routes = routes.map(({path,title}) => ({
    path, title
  })).filter((item) => item.title)

  pageTitles = toSignal(this.router.events.pipe(
    filter(events => events instanceof NavigationEnd),
    map(routes => routes.url),
    map(url => routes.find(r => `/${r.path}` === url)?.title ?? 'No titulo'),
  ))
}
