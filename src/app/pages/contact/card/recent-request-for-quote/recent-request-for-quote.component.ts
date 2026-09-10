import { Component, OnInit, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-contact-card-recent-request-for-quote',
  templateUrl: './recent-request-for-quote.component.html',
  styleUrls: ['./recent-request-for-quote.component.scss'],
  standalone: false
})
@UntilDestroy()
export class RecentRequestForQuoteComponent implements OnInit {

  @Input() user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void { }

}