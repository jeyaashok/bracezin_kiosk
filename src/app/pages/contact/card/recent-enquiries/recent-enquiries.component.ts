import { Component, OnInit, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-contact-card-recent-enquiries',
  templateUrl: './recent-enquiries.component.html',
  styleUrls: ['./recent-enquiries.component.scss'],
  standalone: false
})
@UntilDestroy()
export class RecentEnquiriesComponent implements OnInit {

  @Input() user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void { }

}