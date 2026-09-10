import { Component, OnInit, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-contact-card-profile-ratio',
  templateUrl: './profile-ratio.component.html',
  styleUrls: ['./profile-ratio.component.scss'],
  standalone: false
})
@UntilDestroy()
export class ProfileRatioComponent implements OnInit {

  @Input() user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void { }

}